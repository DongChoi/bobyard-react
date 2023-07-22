"use client";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { MouseEventHandler, useState } from "react";
import { Typography } from "@mui/material";
interface Task {
  id: number;
  title: string;
  description: string;
  userId: number;
  created_at: string;
  due_date: Date | string;
  updatedAt: Date;
  finished_date?: string;
}

const UpdateForm = ({
  updateTask,
  cancelForm,
  task,
}: {
  updateTask: Function;
  cancelForm: Function;
  task: Task;
}) => {
  // const initialFormData = {
  //   title: "Title",
  //   description: "description",
  //   due_date: new Date(),
  // };

  // const noData = Object.keys(task).length === 0;
  const [formData, setFormData] = useState(task);
  // const [calendarError, setCalendarError] = useState<boolean>(false);
  const today = new Date();
  const handleFormSubmit = (
    evt: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    evt.preventDefault();
    let validation = true;
    // // validation for mui/datepicker
    // if (!formData.due_date) {
    //   setCalendarError(true);

    //   validation = false;
    // }
    if (validation == true) {
      updateTask(formData);
    }
  };
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
  //   event
  // ) => {
  //   // if (event.key === "Enter") {
  //   //   event.preventDefault();
  //   //   const target = event.target as HTMLTextAreaElement;
  //   //   const { selectionStart, selectionEnd, value } = target;
  //   //   const beforeCursor = value.substring(0, selectionStart);
  //   //   const afterCursor = value.substring(selectionEnd, value.length);
  //   //   const newDescription = beforeCursor + "\n" + afterCursor;
  //   //   setFormData((prevFormData: Task) => ({
  //   //     ...prevFormData,
  //   //     description: newDescription,
  //   //   }));
  //   //   const nextLineStart = selectionStart + 1;
  //   //   console.log(selectionStart);
  //   //   // Move the cursor to the start of the next line
  //   //   event.target.setSelectionRange(0, 0);
  //   // }
  // };

  const calculateTextAreaRows = (value: string): number => {
    const lineHeight = 18; // Adjust this value according to your textarea's line height
    const rows = Math.ceil(value.split("\n").length);
    return rows < 4 ? 4 : rows;
  };
  console.log(task);
  const handleCalendarChange = async (event: any) => {
    const dateString = event.$d.toLocaleString().split(",")[0];

    setFormData({ ...formData, due_date: dateString });
  };
  const handleCancelButtonClick = () => {
    cancelForm();
  };
  return (
    <div className="h-full">
      <form
        className="h-full flex flex-col shadow-2xl pb-14 border-solid border-2 bg-slate-100 border-slate-200 p-7"
        onSubmit={handleFormSubmit}
      >
        <label className="text-gray-600 p-2">Title</label>
        <input
          required
          className="bg-slate-100 border-solid border-2 border-slate-200 p-2 rounded"
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          style={{ marginBottom: "5px" }}
        />
        <label className="text-gray-600 p-2">Description</label>
        <textarea
          required
          rows={calculateTextAreaRows(formData.description)}
          className="bg-slate-100 border-solid border-2 border-slate-200 p-2 rounded"
          placeholder="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          // onKeyDown={handleKeyDown}
          style={{ marginBottom: "5px" }}
        />
        <label className="p-2">Due Date</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              value={dayjs(formData.due_date)}
              onChange={handleCalendarChange}
              minDate={dayjs().subtract(0, "day")}
            />
          </DemoContainer>
        </LocalizationProvider>
        {/* {calendarError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Ut-Oh! </strong>
            <span className="block sm:inline">
              You forgot to pick a due date.
            </span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )} */}
        <div className="p-2 relative flex-col">
          Additional Details
          <br />
          <br />
          <p>Created on: {new Date(task.created_at).toLocaleDateString()},</p>
          <p>
            Finished Date:{" "}
            {task.finished_date
              ? new Date(task.finished_date).toLocaleDateString()
              : "In progress"}
          </p>
        </div>
      </form>
      <div className="flex absolute right-0 bottom-0 m-3">
        <button
          className="border-solid border-1 rounded bg-sky-200 mr-3 p-2"
          type="submit"
          color="primary"
          onClick={handleFormSubmit}
        >
          Save
        </button>
        <button
          className="border-solid border-1 bg-red-200 rounded mr-3 p-2"
          onClick={handleCancelButtonClick}
        >
          Cancel
        </button>
      </div>
    </div>
    // </div>
  );
};

export default UpdateForm;
