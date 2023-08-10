"use client";

import { useSession } from "next-auth/react";
import "./globals.css";
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
import CompletionMessage from "@/components/CompletionMessage";
import { TaskTable } from "@/components/TaskTable";

interface User {
  id: number | string;
  provider: string;
  providerAccountId: number;
  tasks: Task[];
}

interface SortedTasks {
  "Past Due": Task[];
  "Due Today": Task[];
  Upcoming: Task[];
  Completed: Task[];
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
    "Past Due": [],
    "Due Today": [],
    Upcoming: [],
    Completed: [],
  });
  const [userId, setUserId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [toggleTaskForm, setToggleTaskForm] = useState<boolean>(false);
  const [task, setTask] = useState<Task | null>(null);
  const [filteredOption, setSelectedOption] = useState<
    keyof SortedTasks | "all"
  >("all");

  const handleFilterSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOption(event.target.value as keyof SortedTasks);
  };

  /********************************** On Mount **********************************/
  useEffect(() => {
    async function fetchUser() {
      if (session?.user) {
        const resp = await axios.post("/api/user/", { session: session.user });
        const sortedTasks = sortTasks(resp.data.user.tasks);
        setTasks(sortedTasks);
        console.log(sortedTasks);
        setUserId(resp.data.user.id);
      }
    }
    fetchUser();
  }, [session]);
  //View all tasks, and sort by title, status, and due date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sortTasks = (tasks: Task[]) => {
    const sortedTasks: SortedTasks = {
      "Past Due": [],
      "Due Today": [],
      Upcoming: [],
      Completed: [],
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
      return "Completed";
    } else if (dateDue.getTime() < today.getTime()) {
      return "Past Due";
    } else if (dateDue.getTime() == today.getTime()) {
      return "Due Today";
    } else {
      return "Upcoming";
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
        resp.data.updatedTask.status = newStatus;
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
    } catch (e) {
      console.error(e);
    }
    setTask(null);
  }

  async function removeTask(taskId: Number, status: keyof SortedTasks) {
    try {
      const resp = await axios.delete(`api/tasks/${taskId}`);
    } catch (e) {
      console.error(e);
    }
    const updatedStatusTasks = tasks[status].filter(
      (task) => task.id !== taskId
    );
    const updatedTasks = { ...tasks, [status]: updatedStatusTasks };
    setTasks(updatedTasks);
    //TODO: add animation to show that deletion was successful!
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
            <b className="mr-3 ml-2">{session.user.name}&apos;s Tasks</b>{" "}
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
            {Object.keys(tasks).map((key) => {
              const typedKey = key as keyof SortedTasks;

              if (tasks[typedKey].length > 0) {
                return (
                  <TaskTable
                    tasks={tasks[typedKey]}
                    removeTask={removeTask}
                    filter={filter}
                    openUpdateForm={openUpdateForm}
                    updateTask={updateTask}
                    status={key}
                  />
                );
              }
            })}
            <br />
            <br />
          </section>

          {/* MOBILE */}
          <section className="md:hidden mt-4 mr-6 ml-2 flex-col">
            <b className="mr-3 ml-2">{session.user.name}&apos;s Tasks</b>{" "}
            <select
              className="p-4 mx-3 rounded bg-blue-400"
              value={filteredOption}
              onChange={handleFilterSelectChange}
            >
              <option value="all">All</option>
              <option value="Due Today">Due Today</option>
              <option value="Past Due">Past Due</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
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
            {filteredOption != "all" ? (
              <TableContainer className="m-2 mt-4" component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Complete</TableCell>
                      <TableCell align="left">
                        Title&nbsp;&nbsp;&nbsp;
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks[filteredOption].map((task, idx) => (
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
            ) : (
              <TableContainer className="m-2 mt-4" component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Complete</TableCell>
                      <TableCell align="left">
                        Title&nbsp;&nbsp;&nbsp;
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(tasks).map((key) => {
                      const typedKey = key as keyof SortedTasks;

                      if (tasks[typedKey].length > 0) {
                        return tasks[typedKey].map((task) => {
                          return (
                            <TasksMobile
                              task={task}
                              removeTask={removeTask}
                              filter={filter}
                              openUpdateForm={openUpdateForm}
                              updateTask={updateTask}
                            />
                          );
                        });
                      }
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </section>
          <CompletionMessage />
        </>
      ) : (
        <section className="w-full flex-center">
          <h1 className="hidden sm:flex text-center justify-center items-center pt-5  bg-gradient-to-r from-red-500 to-yellow-500 text-transparent bg-clip-text">
            You have reached Productiver
          </h1>
          <h1 className="sm:hidden flex justify-center items-center pt-5  bg-gradient-to-r from-red-500 to-yellow-500 text-transparent bg-clip-text">
            Productiver
          </h1>
          <h3 className="flex text-center justify-center pt-5">
            App dedicated to increase productivity.
          </h3>
        </section>
      )}
    </div>
  );
};

export default Home;
