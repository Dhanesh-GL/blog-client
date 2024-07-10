import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modall from "./Modal";
import { Typography } from "@mui/material";

export default function DashPosts() {
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/post/getposts?userId=${
            currentUser._id
          }`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/post/getposts?userId=${
          currentUser._id
        }&startIndex=${startIndex}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: 'include',

        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const [open, setOpen] = useState(false);

  return (
    <div className="post-container" >
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Date updated</TableCell>
                  <TableCell>Post image</TableCell>
                  <TableCell>Post title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Delete</TableCell>
                  <TableCell>Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userPosts.map((post) => (
                  <TableRow hover key={post._id}>
                    <TableCell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="post-image"
                        />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ cursor: "pointer" }}
                        component="p"
                        onClick={() => navigate(`/post/${post.slug}`)}
                      >
                        {post.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setOpen(true);
                          setPostIdToDelete(post._id);
                        }}
                        className="delete-button"
                      >
                        Delete
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        className="edit-link"
                        to={`/update-post/${post._id}`}
                      >
                        <span>Edit</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {showMore && (
            <button onClick={handleShowMore} className="show-more-button">
              Show more
            </button>
          )}
        </>
      ) : (
        <Typography color={"text.primary"}>You have no posts yet!</Typography>
      )}

      <Modall
        open={open}
        setOpen={setOpen}
        agree={() => handleDeletePost()}
      ></Modall>
    </div>
  );
}
