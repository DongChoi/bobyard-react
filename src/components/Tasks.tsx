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

const Tasks = ({ filter, tasks }: { filter: string; tasks: Task[] }) => {
  function filterTasks() {}

  return (
    <div>
      {tasks.map((task) => {
        return <div>{task}</div>;
      })}
    </div>
  );
};

export default Tasks;
