"use client";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useState } from "react";
interface Task {
  id?: number;
  title: string;
  description: string;
  userId?: number;
  created_at?: Date;
  due_date: Date | string;
  updatedAt?: Date;
  finished_date?: Date;
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
  const initialFormData = {
    title: task?.title,
    description: task?.description,
    due_date: task?.due_date,
  };

  const [formData, setFormData] = useState(initialFormData);
  // const [calendarError, setCalendarError] = useState<boolean>(false);

  const today = new Date();
  const handleFormSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    let validation = true;
    // // validation for mui/datepicker
    // if (!formData.due_date) {
    //   setCalendarError(true);

    //   validation = false;
    // }
    if (validation == true) {
      updateTask(task.id, formData);
    }
  };
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setFormData((prevFormData) => ({
        ...prevFormData,
        description: prevFormData.description + "\n",
      }));
    }
  };

  const calculateTextAreaRows = (value: string): number => {
    const lineHeight = 18; // Adjust this value according to your textarea's line height
    const rows = Math.ceil(value.split("\n").length);
    return rows < 4 ? 4 : rows;
  };

  const handleCalendarChange = async (event: any) => {
    const dateString = event.$d.toLocaleString().split(",")[0];

    setFormData({ ...formData, due_date: dateString });
  };
  const handleCancelButtonClick = () => {
    cancelForm();
  };
  return (
    <div>
      <form
        className="flex flex-col rounded shadow-2xl pb-14 border-solid border-2 bg-slate-100 border-slate-600 fixed my-auto p-7 mt-7 inset-x-0 w-3/6 mx-auto z-10"
        onSubmit={handleFormSubmit}
      >
        <input
          required
          className="bg-slate-100 border-solid border-2 border-slate-600 rounded"
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          style={{ marginBottom: "5px" }}
        />

        <textarea
          required
          rows={calculateTextAreaRows(formData.description)}
          className="bg-slate-100 border-solid border-2 border-slate-600 rounded"
          placeholder="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ marginBottom: "5px" }}
        />
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
        <div className="flex absolute right-0 bottom-0 m-3">
          <button
            className="border-solid border-1 rounded bg-sky-200 mr-3 p-2"
            type="submit"
            color="primary"
          >
            Update
          </button>
          <button
            className="border-solid border-1 bg-red-200 rounded mr-3 p-2"
            onClick={handleCancelButtonClick}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateForm;
