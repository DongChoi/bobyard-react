"use client";
import {
  Box,
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
  const [open, setOpen] = useState(false);
  function filterTasks() {}
  console.log("task", task);
  const title = task.title;
  const description = task.description;
  const dateCreated = new Date(task.created_at).toLocaleDateString();
  const dateDue = new Date(task.due_date).toLocaleDateString();
  const finishedDate = task.finished_date
    ? new Date(task.finished_date).toLocaleDateString()
    : "In Progress";
  const status =
    finishedDate == "In Progress"
      ? "Completed"
      : dateCreated > dateDue
      ? "Past Due"
      : "In Progress";
  const handleRemoveClick = (taskId: Number) => {
    removeTask(taskId);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        {/* future implementation for getting a graph for api call */}
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right">{status}&nbsp;&nbsp;&nbsp;</TableCell>
        <TableCell align="right">{dateDue}&nbsp;&nbsp;&nbsp;</TableCell>
        <TableCell align="right">{title}&nbsp;&nbsp;&nbsp;</TableCell>
        <TableCell align="right">{dateCreated}&nbsp;&nbsp;&nbsp;</TableCell>
        {/* <TableCell
      style={gainOrLoss ? { color: "green" } : { color: "red" }}
      align="right"
    >
      {gainLossDollars > 0
        ? gainLossPercentage.toFixed(2)
        : (gainLossPercentage).toFixed(2)}
      % &nbsp;
    </TableCell> */}
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
                Created at: {dateCreated}, Finished Date: {finishedDate}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default Tasks;
