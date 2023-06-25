"use client";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useState } from "react";
interface Task {
  id?: number;
  title: String;
  description: String;
  userId?: number;
  created_at?: Date;
  due_date: Date | String;
  updatedAt?: Date;
  finished_date?: Date;
}
const Form = ({
  addTask,
  cancelForm,
}: {
  addTask: Function;
  cancelForm: Function;
}) => {
  const initialFormData = { title: "", description: "", due_date: "" };
  const [formData, setFormData] = useState(initialFormData);
  const today = new Date();
  const handleFormSubmit = () => {
    addTask(formData);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCalendarChange = async (event) => {
    const dateString = event.$d.toLocaleString().split(",")[0];

    setFormData({ ...formData, due_date: dateString });
  };
  const handleCancelButtonClick = () => {
    cancelForm();
  };
  return (
    <div>
      <form
        className="flex flex-col rounded shadow-2xl pb-14 border-solid border-2 bg-slate-100 border-slate-600 fixed my-auto p-7 mt-7 inset-x-0 w-3/6 mx-auto"
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
        <input
          required
          className="bg-slate-100 border-solid border-2 border-slate-600 rounded"
          placeholder="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          style={{ marginBottom: "5px" }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              name="due_date" // eslint-disable-line
              value={""}
              onChange={handleCalendarChange}
              placeholder="Due Date"
              minDate={dayjs().subtract(1, "day")}
            />
          </DemoContainer>
        </LocalizationProvider>
        <div className="flex absolute right-0 bottom-0 m-3">
          <button
            className="border-solid border-1 rounded bg-sky-200 mr-3 p-2"
            type="submit"
            color="primary"
          >
            Add Task
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

export default Form;
