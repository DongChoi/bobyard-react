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
    const resp = await axios.post("api/tasks", {
      session: session?.user,
      taskId,
    });
    return resp;
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
        <section className="border flex">
          <b className="ml-3 mr-3">{session.user.name}&apos;s Tasks</b>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Symbol &nbsp;</TableCell>
                  <TableCell align="right">Purchase Date &nbsp;</TableCell>
                  <TableCell align="right">Qty &nbsp;</TableCell>
                  <TableCell align="right">Amount Invested &nbsp;</TableCell>
                  <TableCell align="right">Purchase Price &nbsp;</TableCell>
                  <TableCell align="right">Current Price &nbsp;</TableCell>
                  <TableCell align="right">Position Value &nbsp;</TableCell>
                  <TableCell align="right">% gain/loss &nbsp;</TableCell>
                  <TableCell align="right">$ gain/loss &nbsp;</TableCell>
                  <TableCell align="right">remove &nbsp;</TableCell>
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
            onClick={(evt) => {
              evt.preventDefault();
              SetToggleCreateTask(true);
            }}
          >
            Add Task
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
