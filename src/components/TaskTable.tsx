import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import TaskRow from "./TaskRow";

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

export const TaskTable = ({
  removeTask,
  filter,
  tasks,
  openUpdateForm,
  updateTask,
  status,
}: {
  removeTask: Function;
  filter: string;
  tasks: Task[];
  openUpdateForm: Function;
  updateTask: Function;
  status: string;
}) => {
  return (
    <div>
      <br />
      <br />
      <b className="mr-3 ml-2">{status}</b>
      <TableContainer className="m-2 mt-4" component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell className="ml-4" align="left">
                {/* do padding instead of &nbsp */}
                &nbsp;&nbsp;&nbsp;&nbsp;Status&nbsp;&nbsp;&nbsp;
              </TableCell>
              <TableCell align="left">Date Due&nbsp;&nbsp;&nbsp;</TableCell>
              <TableCell align="left">Title&nbsp;&nbsp;&nbsp;</TableCell>
              <TableCell align="left">Created&nbsp;&nbsp;&nbsp;</TableCell>
              <TableCell align="left">Complete&nbsp;&nbsp;&nbsp;</TableCell>
              {/* <TableCell align="left">update&nbsp;&nbsp;&nbsp;</TableCell> */}
              <TableCell align="left">delete&nbsp;&nbsp;&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, idx) => (
              <TaskRow
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
    </div>
  );
};
