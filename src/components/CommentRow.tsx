"use client";
import { TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
  image: string;
}

const CommentRow = ({
  comment,
  openUpdateForm,
  updateComment,
}: {
  comment: Comment;
  openUpdateForm: Function;
  updateComment: Function;
}) => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  // console.log(comment);
  const [isExploding, setIsExploding] = useState(false);
  const author = comment.author;
  const text = comment.text;
  const dateCreated = new Date(comment.date);

  const handleUpdateClick = (event: React.MouseEvent) => {
    openUpdateForm(comment);
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        onClick={handleUpdateClick}
      >
        {/* future implementation for getting a graph for api call */}
        <TableCell align="left">
          <span className={"ml-4 whitespace-nowrap"}>
            {comment.author}&nbsp;&nbsp;&nbsp;
          </span>
        </TableCell>
        <TableCell align="left">
          {comment.image ? (
            <div className=" max-w-md">
              <img
                height={100}
                width={100}
                src={comment.image}
                alt="image failed to load"
              />
            </div>
          ) : (
            <></>
          )}
        </TableCell>
        <TableCell align="left">
          {dateCreated.toLocaleDateString()}&nbsp;&nbsp;&nbsp;
        </TableCell>
        <TableCell width={500} align="left">
          {text}&nbsp;&nbsp;&nbsp;
        </TableCell>
        <TableCell align="left">{comment.likes}&nbsp;&nbsp;&nbsp;</TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default CommentRow;
