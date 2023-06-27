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
//this is basically  app.tsx

interface User {
  id: number | string;
  provider: string;
  providerAccountId: number;
  tasks: Task[];
}

interface Task {
  id?: number;
  title: String;
  description: String;
  userId?: number;
  created_at: Date;
  due_date: Date;
  updatedAt: Date;
  finished_date: Date;
}

const Home = () => {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [toggleCreateTask, SetToggleCreateTask] = useState(false);
  useEffect(() => {
    async function fetchUser() {
      if (session?.user) {
        const resp = await axios.post("/api/user/", { session: session.user });
        console.log("resp", resp);
        setTasks(resp.data.user.tasks);
        console.log("tasks =", tasks);
        setUserId(resp.data.user.id);
      }
    }
    fetchUser();
  }, [session]);
  //View all tasks, and sort by title, status, and due date
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
  async function addTask(taskData: Task) {
    const resp = await axios.post("api/tasks", {
      session: session?.user,
      taskData: { ...taskData, userId: 1 },
    });
    console.log(resp, "new task?");
  }
  async function updateTask() {}
  async function completeTask() {}
  function cancelForm() {
    SetToggleCreateTask(false);
  }
  return (
    <>
      {toggleCreateTask && <Form cancelForm={cancelForm} addTask={addTask} />}
      {session?.user ? (
        <section className="mt-4 mr-6 ml-2 flex-col">
          <b className="mr-3 ml-2">{session.user.name}&apos;s Tasks</b>
          <TableContainer className="m-2 mt-4" component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">Status&nbsp;&nbsp;</TableCell>
                  <TableCell align="right">Due Date&nbsp;&nbsp;</TableCell>
                  <TableCell align="right">Title&nbsp;&nbsp;</TableCell>
                  <TableCell align="right">Created &nbsp;&nbsp;</TableCell>
                  <TableCell align="right">remove&nbsp;&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks &&
                  tasks.map((task) => (
                    <Tasks
                      removeTask={removeTask}
                      key={task.id}
                      task={task}
                      filter={filter}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <button
            className="rounded p-4 bg-red-400 m-2"
            onClick={(evt) => {
              evt.preventDefault();
              SetToggleCreateTask(true);
            }}
          >
            New Task
          </button>
        </section>
      ) : (
        <section className=" w-full flex-center">
          <h1 className="">You have reached Productiver</h1>
          <span className="satoshi primary-orange">
            We will help increase your productivity.
          </span>
        </section>
      )}
    </>
  );
};

export default Home;
