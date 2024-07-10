import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import Modall from "./Modal";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/comment/getcomments`,{
          credentials: 'include',

        });
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/comment/getcomments?startIndex=${startIndex}`,{
          credentials: 'include',

        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
          credentials: 'include',

        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
      } 
    } catch (error) {
      console.log(error.message);
    }
  };
  const [open, setOpen] = useState(false);

  return (
    <div className="containerr">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Date updated</TableCell>
                  <TableCell>Comment content</TableCell>
                  <TableCell>Number of likes</TableCell>
                  <TableCell>PostId</TableCell>
                  <TableCell>UserId</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow hover key={comment.content}>
                    <TableCell component="th" scope="row">
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{comment.content}</TableCell>
                    <TableCell>{comment.numberOfLikes}</TableCell>
                    <TableCell>{comment.postId}</TableCell>
                    <TableCell>{comment.userId}</TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setOpen(true);
                          setCommentIdToDelete(comment._id);
                        }}
                        className="delete-button"
                      >
                        Delete
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {showMore && (
            <Button variant='outlined' onClick={handleShowMore} className="show-more-button">
              Show more
            </Button>
          )}
        </>
      ) : (
        <Typography color={'text.primary'}>You have no comments yet!</Typography>

      )}

      <Modall
        open={open}
        setOpen={setOpen}
        agree={() => handleDeleteComment()}
      ></Modall>
    </div>
  );
}
