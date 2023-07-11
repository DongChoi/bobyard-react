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
} from "@mui/material";
import UpdateForm from "@/components/UpdateForm";
import TasksMobile from "@/components/Tasks_mobile";
//this is basically  app.tsx

interface User {
  id: number | string;
  provider: string;
  providerAccountId: number;
  tasks: Task[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  userId: number;
  created_at: Date;
  due_date: Date;
  updatedAt: Date;
  finished_date?: Date;
}

const Home = () => {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [toggleTaskForm, setToggleTaskForm] = useState<boolean>(false);
  const [task, setTask] = useState<Task | null>(null);
  useEffect(() => {
    async function fetchUser() {
      if (session?.user) {
        const resp = await axios.post("/api/user/", { session: session.user });

        setTasks(resp.data.user.tasks);

        setUserId(resp.data.user.id);
      }
    }
    fetchUser();
  }, [session]);
  //View all tasks, and sort by title, status, and due date

  /************************* TASK PUT PATCH DELETE POST *************************/

  async function addTask(taskData: Task) {
    const resp = await axios.post("api/tasks", {
      session: session?.user,
      taskData: { ...taskData, userId: userId },
    });
    const updatedTasks = [...tasks, resp.data.newTask];
    setTasks(updatedTasks);
    setToggleTaskForm(false);
  }

  async function updateTask(taskId: Number, taskPayload: Task) {
    try {
      // console.log(taskId);
      const resp = await axios.patch(`api/tasks/${taskId}`, {
        taskPayload,
      });
      // console.log("response", resp);
      const updatedTasks = tasks.map((item) => {
        if (item.id === taskId) {
          return resp.data.updatedTask;
        }
        return item;
      });
      setTasks(updatedTasks);
      // console.log("UPDATED TASKS", updatedTasks);
    } catch (e) {
      console.log(e);
    }
    setTask(null);
  }

  async function removeTask(taskId: Number) {
    try {
      const resp = await axios.delete(`api/tasks/${taskId}`);
    } catch (e) {
      console.log(e);
    }
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    //add animation to show that deletion was successful!
  }

  /*********************************** FORMS ***********************************/
  function openUpdateForm(task: Task) {
    setTask(task);
  }

  function cancelForm() {
    setToggleTaskForm(false);
    setTask(null);
  }

  return (
    <>
      {toggleTaskForm && <Form cancelForm={cancelForm} addTask={addTask} />}
      {task && (
        <UpdateForm
          cancelForm={cancelForm}
          updateTask={updateTask}
          task={task}
        />
      )}
      {session?.user ? (
        <>
          {/*hidden md:block*/}
          <section className="hidden md:block mt-4 mr-6 ml-2 flex-col">
            <b className="mr-3 ml-2">{session.user.name}&apos;s Tasks</b>
            DESKTOP
            <TableContainer className="m-2 mt-4" component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right">
                      Status&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="right">
                      Due Date&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="right">Title&nbsp;&nbsp;&nbsp;</TableCell>
                    <TableCell align="right">
                      Created&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="right">
                      Finish Task&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="right">
                      update&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell align="right">
                      remove&nbsp;&nbsp;&nbsp;
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks &&
                    tasks.map((task, idx) => (
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

          {/* MOBILE */}
          <section className="md:hidden mt-4 mr-6 ml-2 flex-col">
            <b className="mr-3 ml-2">{session.user.name}&apos;s Tasks</b>
            <TableContainer className="m-2 mt-4" component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell className="px-0" align="right"></TableCell>
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
                <TableBody>
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
                </TableBody>
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
        </>
      ) : (
        <section className="w-full flex-center">
          <h1 className="flex justify-center items-center pt-5  bg-gradient-to-r from-red-500 to-yellow-500 text-transparent bg-clip-text">
            You have reached Productiver
          </h1>
          <h3 className="flex justify-center pt-5">
            App dedicated to increase productivity.
          </h3>
        </section>
      )}
    </>
  );
};

export default Home;
