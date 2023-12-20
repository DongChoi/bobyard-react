import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import TaskRow from "./CommentRow";

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
  image: string;
}

export const CommentTable = ({
  removeComment,

  comments,
  openUpdateForm,
  updateComment,
}: {
  removeComment: Function;

  comments: Comment[];
  openUpdateForm: Function;
  updateComment: Function;
}) => {
  return (
    <div>
      <br />
      <br />
      <b className="mr-3 ml-2">{status}</b>
      <TableContainer className="m-2 mt-4" component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell className="ml-4" align="left">
                {/* do padding instead of &nbsp */}
                &nbsp;&nbsp;&nbsp;&nbsp;Author&nbsp;&nbsp;&nbsp;
              </TableCell>

              <TableCell align="left">Last Updated&nbsp;&nbsp;&nbsp;</TableCell>
              <TableCell align="left">Image&nbsp;&nbsp;&nbsp;</TableCell>
              <TableCell align="left">Comment&nbsp;&nbsp;&nbsp;</TableCell>
              <TableCell align="left">likes&nbsp;&nbsp;&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments.map((comment, idx) => (
              <TaskRow
                key={comment.id}
                comment={comment}
                openUpdateForm={openUpdateForm}
                updateComment={updateComment}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
