"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Form from "@/components/Form";
import UpdateCommentForm from "@/components/UpdateForm";

import { CommentTable } from "@/components/CommentTable";
import UpdateForm from "@/components/UpdateForm";

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
  image: string;
}

const Home = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const [toggleTaskForm, setToggleTaskForm] = useState<boolean>(false);
  const [comment, setComment] = useState<Comment | null>(null);

  /********************************** On Mount **********************************/
  useEffect(() => {
    async function fetchComments() {
      const resp = await axios.get("http://127.0.0.1:8000/comments/");
      console.log("resp", resp);
      const fetchedComments = resp.data.comments;

      setComments(fetchedComments);
    }
    fetchComments();
  }, []);
  //View all comments, and sort by title, status, and due date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /************************* COMMENT PUT PATCH DELETE POST *************************/

  async function addComment(commentData: Comment) {
    const resp = await axios.post("http://localhost.8000/comments/add", {
      commentData,
    });
    // console.log(resp);
    setComments((prevComments) => [...prevComments, resp.data]);
    setToggleTaskForm(false);
  }

  async function updateComment(commentPayload: Comment) {
    try {
      const prevText = commentPayload.text;
      const commentId = commentPayload.id;
      const resp = await axios.patch(
        `http://localhost:8000/comments/${commentPayload.id}`,
        {
          commentPayload,
        }
      );
      const updatedComments = comments.map((comment) => {
        if (comment.id === resp.data.id) {
          return resp.data;
        }
        return comment;
      });
      setComments(updatedComments);
    } catch (e) {
      console.error(e);
    }
    setComment(null);
  }

  async function removeComment(id: String) {
    try {
      const resp = await axios.delete(`http://localhost:8000/comments/${id}`);
    } catch (e) {
      console.error(e);
    }
    const updatedComments = comments.filter((comment) => comment.id !== id);
    const updatedTasks = { ...updatedComments };
    setComments(updatedTasks);
    //TODO: add animation to show that deletion was successful!
  }

  /*********************************** FORMS ***********************************/
  function openUpdateForm(comment: Comment) {
    setComment(comment);
  }

  function cancelForm() {
    setToggleTaskForm(false);
    setComment(null);
  }

  return (
    <div className="relative z-10">
      {toggleTaskForm && (
        <Form cancelForm={cancelForm} addComment={addComment} />
      )}
      <div
        className={`${
          !comment && "invisible"
        } fixed h-screen inset-0 w-screen z-10`}
      >
        <div
          onClick={cancelForm}
          className={`h-full w-full inset-0 transition-all ease-out duration-[1000ms] bg-gray-200 
        ${!comment ? "opacity-0" : "opacity-50"} 
        right-0 top-0 z-50`}
        ></div>
        <div
          className={`absolute ease-out duration-[1000ms] transition-all ${
            !comment ? "translate-x-full" : "translate-x-0"
          }  h-full right-0 top-0 w-full sm:w-2/5 z-20`}
        >
          {comment && (
            <UpdateForm
              cancelForm={cancelForm}
              updateComment={updateComment}
              removeComment={removeComment}
              comment={comment}
            />
          )}
        </div>
      </div>

      <>
        {/*hidden md:block*/}
        <section className="block mt-4 mr-6 ml-2 flex-col">
          <b className="mr-3 ml-2">Comments</b>{" "}
          <button
            className="rounded px-4 py-3 bg-[#A8DADC] m-2"
            //bg-blue-300
            onClick={(evt) => {
              evt.preventDefault();
              setToggleTaskForm(true);
            }}
          >
            <span className="text-xl">+</span> New
          </button>
          {comments.length > 0 && (
            <CommentTable
              comments={comments}
              removeComment={removeComment}
              openUpdateForm={openUpdateForm}
              updateComment={updateComment}
            />
          )}
          <br />
          <br />
        </section>
      </>
    </div>
  );
};

export default Home;
