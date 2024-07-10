import { Button, TextField } from "@mui/material";
import * as React from "react";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import Modall from "./Modal";
export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/comment/create`,
        {
          method: "POST",
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: comment,
            postId,
            userId: currentUser._id,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/comment/getPostComments/${postId}`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/comment/likeComment/${commentId}`,
        {
          method: "PUT",
          credentials: 'include',

        }
      );
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async () => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/comment/deleteComment/${commentToDelete}`,
        {
          method: "DELETE",
          credentials: 'include',

        }
      );
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.filter((comment) => comment._id !== commentToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <div className="container" style={{paddingRight:"0px",paddingLeft:"0px"}}>
      {currentUser ? (
        <div className="user-info">
          <Typography>Signed in as:</Typography>
          <img className="avatar" src={currentUser.profilePicture} alt="" />
          <Link to={"/dashboard?tab=profile"} className="username-link">
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="sign-in-info">
          <Typography>You must be signed in to comment.</Typography>
          <Link to={"/sign-in"} className="sign-in-link">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className="comment-form">
          <TextField
            label="Comment"
            id="comment-input"
            fullWidth
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="comment-info">
            <Typography>{200 - comment.length} characters remaining</Typography>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </div>
          {commentError && <Alert severity="error">{commentError}</Alert>}
        </form>
      )}
      {comments.length === 0 ? (
        <Typography className="no-comments">No comments yet!</Typography>
      ) : (
        <>
          <div className="comment-count">
            <Typography>Comments</Typography>
            <div className="comment-count-box">
              <Typography>{comments.length}</Typography>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setOpen(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}

      <Modall
        open={open}
        setOpen={setOpen}
        agree={() => handleDelete()}
      ></Modall>
    </div>
  );
}
