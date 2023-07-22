"use client";

import Feed from "@/components/Feed";
import { useSession } from "next-auth/react";
import "./globals.css";
import Tasks from "@/components/Tasks";
import { useEffect, useState } from "react";
import axios from "axios";
import Form from "@/components/Form";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import UpdateForm from "@/components/UpdateForm";
import TasksMobile from "@/components/Tasks_mobile";
import CompletionMessage from "@/components/CompletionMessage";
//this is basically  app.tsx

interface User {
  id: number | string;
  provider: string;
  providerAccountId: number;
  tasks: Task[];
}

interface SortedTasks {
  pastDue: Task[];
  dueToday: Task[];
  completed: Task[];
  dueInTheFuture: Task[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  userId: number;
  created_at: string;
  due_date: Date | string;
  updatedAt: Date;
  finished_date?: string;
  status?: string;
}

const Home = () => {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<SortedTasks>({
    pastDue: [],
    dueToday: [],
    completed: [],
    dueInTheFuture: [],
  });
  const [userId, setUserId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [toggleTaskForm, setToggleTaskForm] = useState<boolean>(false);
  const [task, setTask] = useState<Task | null>(null);

  /********************************** On Mount **********************************/
  useEffect(() => {
    async function fetchUser() {
      if (session?.user) {
        const resp = await axios.post("/api/user/", { session: session.user });
        const sortedTasks = sortTasks(resp.data.user.tasks);
        setTasks(sortedTasks);

        setUserId(resp.data.user.id);
      }
    }
    fetchUser();
  }, [session]);
  //View all tasks, and sort by title, status, and due date
  console.log(tasks);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sortTasks = (tasks: Task[]) => {
    const sortedTasks: SortedTasks = {
      pastDue: [],
      dueToday: [],
      completed: [],
      dueInTheFuture: [],
    };
    tasks.forEach((task) => {
      const status = determineStatus(task);
      task.status = status;
      sortedTasks[status].push(task);
    });
    return sortedTasks;
  };

  const determineStatus = (task: Task) => {
    const dateDue = new Date(task.due_date);
    dateDue.setHours(0, 0, 0, 0);
    if (task.finished_date) {
      return "completed";
    } else if (dateDue.getTime() < today.getTime()) {
      console.log(
        "gettingtime",
        dateDue,
        dateDue.getTime(),
        today,
        today.getTime(),
        task
      );
      return "pastDue";
    } else if (dateDue.getTime() == today.getTime()) {
      return "dueToday";
    } else {
      return "dueInTheFuture";
    }
  };
  /************************* TASK PUT PATCH DELETE POST *************************/

  async function addTask(taskData: Task) {
    const resp = await axios.post("api/tasks", {
      session: session?.user,
      taskData: { ...taskData, userId: userId },
    });
    // console.log(resp);
    const status = determineStatus(resp.data.newTask);
    const newStatusArray = [...tasks[status], resp.data.newTask];
    const updatedTasks = { ...tasks, [status]: newStatusArray };
    console.log(updatedTasks);
    setTasks(updatedTasks);
    setToggleTaskForm(false);
  }

  async function updateTask(taskPayload: Task) {
    try {
      const prevStatus = taskPayload.status as keyof SortedTasks;

      const resp = await axios.patch(`api/tasks/${taskPayload.id}`, {
        taskPayload,
      });

      const updatedPrevStatusTasks = tasks[prevStatus].filter(
        (item) => item.id !== taskPayload.id
      );
      const newStatus = determineStatus(resp.data.updatedTask);

      if (prevStatus === newStatus) {
        const newStatusObject = tasks[newStatus].map((item) => {
          if (item.id === taskPayload.id) {
            return resp.data.updatedTask;
          }
          return item;
        });
        const updatedTasks = {
          ...tasks,
          [newStatus]: newStatusObject,
        };
        setTasks(updatedTasks);
      } else {
        const updatedNewStatusTasks = [
          ...tasks[newStatus],
          resp.data.updatedTask,
        ];
        const updatedTasks = {
          ...tasks,
          [prevStatus]: updatedPrevStatusTasks,
          [newStatus]: updatedNewStatusTasks,
        };
        setTasks(updatedTasks);
      }
      // console.log("UPDATED TASKS", updatedTasks);
    } catch (e) {
      console.error(e);
    }
    setTask(null);
  }

  async function removeTask(taskId: Number, status: keyof SortedTasks) {
    try {
      const resp = await axios.delete(`api/tasks/${taskId}`);
    } catch (e) {
      console.log(e);
    }
    const updatedStatusTasks = tasks[status].filter(
      (task) => task.id !== taskId
    );
    const updatedTasks = { ...tasks, [status]: updatedStatusTasks };
    setTasks(updatedTasks);
    //add animation to show that deletion was successful!
  }

  /*********************************** FORMS ***********************************/
  function openUpdateForm(task: Task) {
    setTask(task);
    console.log(task);
  }

  function cancelForm() {
    setToggleTaskForm(false);
    setTask(null);
  }

  return (
    <div className="relative z-10">
      {toggleTaskForm && <Form cancelForm={cancelForm} addTask={addTask} />}
      <div
        className={`${
          !task && "invisible"
        } fixed h-screen inset-0 w-screen z-10`}
      >
        <div
          onClick={cancelForm}
          className={`h-full w-full inset-0 transition-all ease-out duration-[1000ms] bg-gray-200 
        ${!task ? "opacity-0" : "opacity-50"} 
        right-0 top-0 z-50`}
        ></div>
        <div
          className={`absolute ease-out duration-[1000ms] transition-all ${
            !task ? "translate-x-full" : "translate-x-0"
          }  h-full right-0 top-0 w-full sm:w-2/5 z-20`}
        >
          {task && (
            <UpdateForm
              cancelForm={cancelForm}
              updateTask={updateTask}
              task={task}
            />
          )}
        </div>
      </div>

      {session?.user ? (
        <>
          {/*hidden md:block*/}
          <section className="hidden md:block mt-4 mr-6 ml-2 flex-col">
            <b className="mr-3 ml-2">{session.user.name}'s Tasks</b>{" "}
            <button
              className="rounded px-4 py-3 bg-[#A8DADC] m-2"
              //bg-blue-300
              onClick={(evt) => {
                evt.preventDefault();
                setToggleTaskForm(true);
              }}
            >
              <span className="text-xl">+</span> New
            </button>
            <br />
            <br />
            <b className="mr-3 ml-2">Due Today</b>
            <TableContainer className="m-2 mt-4" component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell className="ml-4" align="left">
                      {/* do padding instead of &nbsp */}
                      &nbsp;&nbsp;&nbsp;&nbsp;Status&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="left">
                      Date Due&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="left">Title&nbsp;&nbsp;&nbsp;</TableCell>
                    <TableCell align="left">
                      Created&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="left">
                      Complete&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    {/* <TableCell align="left">update&nbsp;&nbsp;&nbsp;</TableCell> */}
                    <TableCell align="left">delete&nbsp;&nbsp;&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks &&
                    tasks.dueToday &&
                    tasks.dueToday.map((task, idx) => (
                      <Tasks
                        removeTask={removeTask}
                        key={task.id}
                        task={task}
                        openUpdateForm={openUpdateForm}
                        filter={filter}
                        updateTask={updateTask}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
            <br />
            <b className="mr-3 ml-2">Completed</b>
            <TableContainer className="m-2 mt-4" component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell className="ml-4" align="left">
                      {/* do padding instead of &nbsp */}
                      &nbsp;&nbsp;&nbsp;&nbsp;Status&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="left">
                      Date Due&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="left">Title&nbsp;&nbsp;&nbsp;</TableCell>
                    <TableCell align="left">
                      Created&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="left">
                      Complete&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    {/* <TableCell align="left">update&nbsp;&nbsp;&nbsp;</TableCell> */}
                    <TableCell align="left">delete&nbsp;&nbsp;&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks &&
                    tasks.completed &&
                    tasks.completed.map((task, idx) => (
                      <Tasks
                        removeTask={removeTask}
                        key={task.id}
                        task={task}
                        openUpdateForm={openUpdateForm}
                        filter={filter}
                        updateTask={updateTask}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
            <br />
            <b className="mr-3 ml-2">Due In The Future</b>
            <TableContainer className="m-2 mt-4" component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell className="ml-4" align="left">
                      {/* do padding instead of &nbsp */}
                      &nbsp;&nbsp;&nbsp;&nbsp;Status&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="left">
                      Date Due&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="left">Title&nbsp;&nbsp;&nbsp;</TableCell>
                    <TableCell align="left">
                      Created&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="left">
                      Complete&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    {/* <TableCell align="left">update&nbsp;&nbsp;&nbsp;</TableCell> */}
                    <TableCell align="left">delete&nbsp;&nbsp;&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks &&
                    tasks.dueInTheFuture &&
                    tasks.dueInTheFuture.map((task, idx) => (
                      <Tasks
                        removeTask={removeTask}
                        key={task.id}
                        task={task}
                        openUpdateForm={openUpdateForm}
                        filter={filter}
                        updateTask={updateTask}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
            <br />
            <b className="mr-3 ml-2">Past Due</b>
            <TableContainer className="m-2 mt-4" component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell className="ml-4" align="left">
                      {/* do padding instead of &nbsp */}
                      &nbsp;&nbsp;&nbsp;&nbsp;Status&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="left">
                      Date Due&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="left">Title&nbsp;&nbsp;&nbsp;</TableCell>
                    <TableCell align="left">
                      Created&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="left">
                      Complete&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    {/* <TableCell align="left">update&nbsp;&nbsp;&nbsp;</TableCell> */}
                    <TableCell align="left">delete&nbsp;&nbsp;&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks &&
                    tasks.pastDue &&
                    tasks.pastDue.map((task, idx) => (
                      <Tasks
                        removeTask={removeTask}
                        key={task.id}
                        task={task}
                        openUpdateForm={openUpdateForm}
                        filter={filter}
                        updateTask={updateTask}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Display task info on side */}
          </section>

          {/* MOBILE */}
          <section className="md:hidden mt-4 mr-6 ml-2 flex-col">
            <b className="mr-3 ml-2">{session.user.name}&apos;s Tasks</b>
            <TableContainer className="m-2 mt-4" component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell className="px-0" align="left"></TableCell>
                    <TableCell align="left">Complete</TableCell>

                    {/* <TableCell align="right">
                      Due Date&nbsp;&nbsp;&nbsp;
                    </TableCell> */}
                    <TableCell align="left">Title&nbsp;&nbsp;&nbsp;</TableCell>
                    {/* <TableCell align="right">
                      Created&nbsp;&nbsp;&nbsp;
                    </TableCell> */}
                    {/* <TableCell align="right">
                      update&nbsp;&nbsp;&nbsp;
                    </TableCell> */}
                    {/* <TableCell align="right">
                      remove&nbsp;&nbsp;&nbsp;
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                {/* <TableBody>
                  {tasks &&
                    tasks.map((task, idx) => (
                      <TasksMobile
                        removeTask={removeTask}
                        key={task.id}
                        task={task}
                        openUpdateForm={openUpdateForm}
                        filter={filter}
                        updateTask={updateTask}
                      />
                    ))}
                </TableBody> */}
              </Table>
            </TableContainer>
            <button
              className="rounded p-4 bg-[#A8DADC] m-2"
              //bg-blue-300
              onClick={(evt) => {
                evt.preventDefault();
                setToggleTaskForm(true);
              }}
            >
              New Task
            </button>
          </section>
          <CompletionMessage />
        </>
      ) : (
        <section className="w-full flex-center">
          <h1 className="hidden sm:flex text-center justify-center items-center pt-5  bg-gradient-to-r from-red-500 to-yellow-500 text-transparent bg-clip-text">
            You have reached Productiver
          </h1>
          <h3 className="hidden sm:flex text-center justify-center pt-5">
            App dedicated to increase productivity.
          </h3>
          <h1 className="sm:hidden flex justify-center items-center pt-5  bg-gradient-to-r from-red-500 to-yellow-500 text-transparent bg-clip-text">
            Productiver
          </h1>
          <h3 className="sm:hidden text-center flex justify-center pt-5">
            App dedicated to increase productivity.
          </h3>
        </section>
      )}
    </div>
  );
};

export default Home;
