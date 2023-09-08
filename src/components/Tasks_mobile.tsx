"use client";
import {
  Box,
  Checkbox,
  Collapse,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import Image from "next/image";
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
  console.log(task);
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
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" }, overflow: "hidden" }}
        onClick={() => setOpen(!open)}
      >
        {/* future implementation for getting a graph for api call */}
        <TableCell align="left">
          <Checkbox
            {...label}
            onClick={handleToggleTask}
            checked={task.status === "completed" ? true : false}
          />
        </TableCell>

        <TableCell align="left">{title}&nbsp;&nbsp;&nbsp;</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Description
              </Typography>
              {/* <pre> */}
              <div style={{ whiteSpace: "pre-line" }}>
                <Typography variant="body1" gutterBottom component="div">
                  {description}
                </Typography>
              </div>
              {/* </pre> */}
            </Box>{" "}
            <Box sx={{ margin: 1 }}>
              <Typography variant="button" gutterBottom component="div">
                Details
              </Typography>
              <Typography variant="body2" gutterBottom component="div">
                Status:{" "}
                <span
                  className={
                    task.status == "Due Today" || task.status == "Upcoming"
                      ? "text-orange-400"
                      : task.status == "Completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {task.status}&nbsp;&nbsp;&nbsp;
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
