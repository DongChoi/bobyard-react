"use client";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useState } from "react";

const Form = ({
  addComment,
  cancelForm,
}: {
  addComment: Function;
  cancelForm: Function;
}) => {
  const initialFormData = { text: "", image: "" };
  const [formData, setFormData] = useState(initialFormData);
  const [titleError, setTextError] = useState<boolean>(false);

  const handleFormSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    // console.log("duedate", formData.due_date);
    if (!formData.text) {
      setTextError(true);
    } else {
      const date = new Date();
      const user = "admin";
      addComment({ ...formData, date, user });
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
        description: prevFormData.text + "\n",
      }));
    }
  };

  const calculateTextAreaRows = (value: string): number => {
    const lineHeight = 18; // Adjust this value according to your textarea's line height
    const rows = Math.ceil(value.split("\n").length);
    return rows < 4 ? 4 : rows;
  };
  const handleCancelButtonClick = () => {
    cancelForm();
  };
  return (
    <div>
      <form
        className=" top-0 sm:top-auto left-0 h-screen sm:h-auto w-screen flex flex-col rounded shadow-2xl pb-14 border-solid border-2 bg-slate-100 border-slate-600 sm:fixed my-auto p-7 sm:mt-7 inset-x-0 sm:w-3/6 sm:mx-auto z-10"
        onSubmit={handleFormSubmit}
      >
        <textarea
          required
          rows={calculateTextAreaRows(formData.text)}
          className="bg-slate-100 border-solid border-2 border-slate-600 rounded"
          placeholder="Comment here!"
          name="text"
          value={formData.text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ marginBottom: "5px" }}
        />

        <input
          required
          className="bg-slate-100 border-solid border-2 border-slate-600 rounded"
          placeholder="Please paste an image link here"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          style={{ marginBottom: "5px" }}
        />
        <div className="flex absolute right-0 bottom-0 m-3">
          <button
            className="border-solid border-1 rounded bg-sky-200 mr-3 p-2"
            type="submit"
            color="primary"
          >
            Add Comment
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
