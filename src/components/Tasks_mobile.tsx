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

const TasksMobile = ({
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

  const handleRemoveClick = (taskId: Number) => {
    removeTask(taskId);
  };

  console.log(title, "\n", today, "\n", dateDue, status, finishedDate);
  // console.log(task.id, "task.finishedDate", task.finished_date);
  // console.log("finishedDate", finishedDate);

  const handleToggleTask = () => {
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
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        {/* future implementation for getting a graph for api call */}
        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">
          <Checkbox
            {...label}
            onClick={handleToggleTask}
            checked={status === "Completed" ? true : false}
          />
        </TableCell>
        {/* <TableCell align="right">
          <span
            className={
              status == "In Progress"
                ? "text-orange-400"
                : status == "Completed"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {status}&nbsp;&nbsp;&nbsp;
          </span>
        </TableCell> */}
        {/* <TableCell align="right">
          {dateDue.toLocaleDateString()}&nbsp;&nbsp;&nbsp;
        </TableCell> */}
        <TableCell align="left">{title}&nbsp;&nbsp;&nbsp;</TableCell>
        {/* <TableCell align="right">
          {dateCreated.toLocaleDateString()}&nbsp;&nbsp;&nbsp;
        </TableCell> */}

        {/* <TableCell align="right" className="">
          <Image
            className="mx-auto pb-0  mr-3"
            src="edit.svg"
            alt="edit svg"
            width={20}
            height={20}
            onClick={() => {
              openUpdateForm(task);
            }}
          />
          &nbsp;&nbsp;&nbsp;
        </TableCell> */}
        {/* <TableCell align="right">
          <button
            onClick={() => {
              handleRemoveClick(task.id!);
            }}
            style={{ backgroundColor: "white", border: "0px" }}
          >
            X&nbsp;&nbsp;&nbsp;&nbsp;
          </button>
        </TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Description
              </Typography>
              <pre>
                <Typography variant="body1" gutterBottom component="div">
                  {description}
                </Typography>
              </pre>
            </Box>{" "}
            <Box sx={{ margin: 1 }}>
              <Typography variant="button" gutterBottom component="div">
                Details
              </Typography>
              <Typography variant="body2" gutterBottom component="div">
                Status:{" "}
                <span
                  className={
                    status == "In Progress"
                      ? "text-orange-400"
                      : status == "Completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {status}&nbsp;&nbsp;&nbsp;
                </span>{" "}
                <br />
                Date Due: {dateDue.toLocaleDateString()} <br />
                Date Finished:{" "}
                {finishedDate == "In Progress" ? "N/A" : finishedDate} <br />
                Date Created: {dateCreated.toLocaleDateString()}
              </Typography>{" "}
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography variant="button">Actions</Typography>
              <br />
              <div className="flex items-center justify-between">
                <div
                  className="flex mt-2"
                  onClick={() => {
                    openUpdateForm(task);
                  }}
                >
                  Update Task &nbsp;
                  <Image
                    className="pb-0 ml-0"
                    src="edit.svg"
                    alt="edit svg"
                    width={20}
                    height={20}
                  />{" "}
                </div>
                <br />
                <div
                  className="flex mt-2"
                  onClick={() => {
                    handleRemoveClick(task.id!);
                  }}
                >
                  Delete Task &nbsp;
                  <Image
                    className="pb-0 ml-0"
                    src="trash.svg"
                    alt="trash svg"
                    width={20}
                    height={20}
                    onClick={() => {
                      handleRemoveClick(task.id!);
                    }}
                  />
                </div>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default TasksMobile;
