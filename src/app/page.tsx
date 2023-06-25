"use client";

import Feed from "@/components/Feed";
import { useSession } from "next-auth/react";
import "./globals.css";
import Tasks from "@/components/Tasks";
import { useEffect, useState } from "react";
import axios from "axios";
import Form from "@/components/Form";
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
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [toggleCreateTask, SetToggleCreateTask] = useState(false);
  useEffect(() => {
    async function fetchUser() {
      if (session?.user) {
        const resp = await axios.post("/api/user/", { session: session.user });
        console.log("resp", resp);
        setTasks(resp.data.user.tasks);
        setUserId(resp.data.user.id);
      }
    }
    fetchUser();
  }, []);
  //View all tasks, and sort by title, status, and due date
  async function removeTask() {}
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
          {tasks && <Tasks filter={filter} tasks={tasks} />}
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
