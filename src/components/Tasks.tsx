import React from "react";

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

const Tasks = ({
  removeTask,
  filter,
  task,
}: {
  removeTask: Function;
  filter: string;
  task: Task;
}) => {
  function filterTasks() {}
  console.log("task", task);
  return <div>{task.id}</div>;
};

export default Tasks;
