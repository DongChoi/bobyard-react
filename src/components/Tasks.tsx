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
  const title = task.title;
  const description = task.description;
  const dateCreated = new Date(task.created_at);
  const dateDue = new Date(task.due_date);
  const finishedDate = task.finished_date
    ? new Date(task.finished_date).toLocaleDateString()
    : "In Progress";
  const status =
    finishedDate == "In Progress"
      ? "In Progress"
      : today > dateDue
      ? "Past Due"
      : "Completed";
  const handleRemoveClick = (taskId: Number) => {
    removeTask(taskId);
  };

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
        <TableCell align="right">
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
        </TableCell>
        <TableCell align="right">
          {dateDue.toLocaleDateString()}&nbsp;&nbsp;&nbsp;
        </TableCell>
        <TableCell align="right">{title}&nbsp;&nbsp;&nbsp;</TableCell>
        <TableCell align="right">
          {dateCreated.toLocaleDateString()}&nbsp;&nbsp;&nbsp;
        </TableCell>
        <TableCell align="right">
          {finishedDate === "Completed" ? (
            <Checkbox {...label} onClick={handleToggleTask} defaultChecked />
          ) : (
            <Checkbox {...label} onClick={handleToggleTask} />
          )}
        </TableCell>
        <TableCell align="right">
          <UpdateIcon
            onClick={() => {
              openUpdateForm(task);
            }}
          />
          &nbsp;&nbsp;&nbsp;
        </TableCell>
        <TableCell align="right">
          <button
            onClick={() => {
              handleRemoveClick(task.id!);
            }}
            style={{ backgroundColor: "white", border: "0px" }}
          >
            X&nbsp;&nbsp;&nbsp;&nbsp;
          </button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Description
              </Typography>
              <Typography variant="body1" gutterBottom component="div">
                {description}
              </Typography>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography variant="button" gutterBottom component="div">
                Details
              </Typography>
              <Typography variant="body2" gutterBottom component="div">
                Created at: {dateCreated.toLocaleDateString()}, Finished Date:{" "}
                {finishedDate}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default Tasks;
