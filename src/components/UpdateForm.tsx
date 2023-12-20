"use client";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { MouseEventHandler, useState } from "react";
import { Typography } from "@mui/material";
import Image from "next/image";
interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
  image: string;
}

const UpdateForm = ({
  updateComment,
  cancelForm,
  removeComment,
  comment,
}: {
  updateComment: Function;
  cancelForm: Function;
  removeComment: Function;
  comment: Comment;
}) => {
  // const initialFormData = {
  //   title: "Title",
  //   description: "description",
  //   due_date: new Date(),
  // };

  // const noData = Object.keys(task).length === 0;
  const [formData, setFormData] = useState(comment);
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
      updateComment(formData);
    }
  };

  const handleRemoveClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    removeComment(comment.id);
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

  const handleCancelButtonClick = () => {
    cancelForm();
  };
  return (
    <div className="h-full">
      <form
        className="h-full flex flex-col shadow-2xl pb-14 border-solid border-2 bg-slate-100 border-slate-200 p-7"
        onSubmit={handleFormSubmit}
      >
        <label className="text-gray-600 p-2">Author: {comment.author}</label>
        <label className="text-gray-600 p-2">Comment</label>
        <textarea
          required
          rows={calculateTextAreaRows(formData.text)}
          className="bg-slate-100 border-solid border-2 border-slate-200 p-2 rounded"
          placeholder="comment here!"
          name="text"
          value={formData.text}
          onChange={handleInputChange}
          // onKeyDown={handleKeyDown}
          style={{ marginBottom: "5px" }}
        />
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
          className="border-solid border-1 rounded bg-orange-200 mr-3 p-2"
          onClick={handleRemoveClick}
        >
          Delete
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
