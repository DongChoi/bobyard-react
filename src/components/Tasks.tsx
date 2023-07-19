"use client";
import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React, { useState } from "react";
import UpdateIcon from "@mui/icons-material/Update";
import { UpdateDisabled } from "@mui/icons-material";
import Image from "next/image";
interface Task {
  id?: number;
  title: String;
  description: String;
  userId?: number;
  created_at: Date;
  due_date: Date;
  updatedAt?: Date;
  finished_date?: Date;
}

const Tasks = ({
  removeTask,
  filter,
  task,
  openUpdateForm,
  updateTask,
}: {
  removeTask: Function;
  filter: string;
  task: Task;
  openUpdateForm: Function;
  updateTask: Function;
}) => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [open, setOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const title = task.title;
  const description = task.description;
  const dateCreated = new Date(task.created_at);
  const dateDue = new Date(task.due_date);
  dateDue.setHours(0, 0, 0, 0);
  const finishedDate = task.finished_date
    ? new Date(task.finished_date).toLocaleDateString()
    : "In Progress";
  const status =
    finishedDate == "In Progress" && today > dateDue
      ? "Past Due"
      : finishedDate == "In Progress"
      ? "In Progress"
      : "Completed";

  const handleRemoveClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    removeTask(task.id);
  };

  const handleUpdateClick = (event: React.MouseEvent) => {
    openUpdateForm(task);
  };

  // console.log(task.id, "task.finishedDate", task.finished_date);
  // console.log("finishedDate", finishedDate);

  const handleToggleTask = (event: React.MouseEvent) => {
    event.stopPropagation();
    const stringToday = today.toLocaleDateString();
    const taskPayload: { finished: boolean; stringToday: string } = {
      finished: true,
      stringToday,
    };
    if (finishedDate === "In Progress" || finishedDate === "Past Due") {
      taskPayload.finished = true;
    } else {
      taskPayload.finished = false;
    }
    updateTask(task.id, taskPayload);
  };

  function filterTasks() {}

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        onClick={handleUpdateClick}
      >
        {/* future implementation for getting a graph for api call */}
        <TableCell align="left">
          <span
            className={`
            ml-4
            ${
              status == "In Progress"
                ? "text-orange-400"
                : status == "Completed"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {status}&nbsp;&nbsp;&nbsp;
          </span>
        </TableCell>
        <TableCell align="left">
          {dateDue.toLocaleDateString()}&nbsp;&nbsp;&nbsp;
        </TableCell>
        <TableCell align="left">{title}&nbsp;&nbsp;&nbsp;</TableCell>
        <TableCell align="left">
          {dateCreated.toLocaleDateString()}&nbsp;&nbsp;&nbsp;
        </TableCell>

        <TableCell align="left">
          <Checkbox
            sx={{ zIndex: 0 }}
            {...label}
            onClick={handleToggleTask}
            checked={status === "Completed" ? true : false}
          />
        </TableCell>
        {/* <TableCell align="left" className=""> */}
        {/* <Image
            className="pb-0  mr-3"
            src="edi.svg"
            alt="edit svg"
            width={20}
            height={20}
            onClick={handleUpdateClick}
          /> */}
        {/* &nbsp;&nbsp;&nbsp; */}
        {/* </TableCell> */}
        <TableCell align="left">
          <Image
            className="pb-0 mr-3 cursor-pointer"
            src="trash.svg"
            alt="trash svg"
            width={24}
            height={24}
            onClick={handleRemoveClick}
          />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default Tasks;
