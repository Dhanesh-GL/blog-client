import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";

import { Link } from "react-router-dom";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";

export default function DashboardComp({ setValue }) {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/user/getusers?limit=5`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/post/getposts?limit=5`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/comment/getcomments?limit=5`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);
  const handleSet = () => {};
  return (
    <Paper
      sx={{ width: "100%", minHeight: "calc(100vh - 69px)" }}
    >
      <Grid container  px={1} pt={1}>
        <Grid item xs={12} md={4} p={1}  >
          <Paper elevation={4}>
            <Box p={2}>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Total Users
                  </Typography>
                  <Typography variant="h4">{totalUsers}</Typography>
                </Box>
                <HiOutlineUserGroup size={40} />
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <HiArrowNarrowUp color="green" />
                <Typography variant="body2" color="textSecondary">
                  {lastMonthUsers} Last month
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} p={1}>
          <Paper elevation={4}>
            <Box p={2}>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Total Comments
                  </Typography>
                  <Typography variant="h4">{totalComments}</Typography>
                </Box>
                <HiAnnotation size={40} />
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <HiArrowNarrowUp color="green" />
                <Typography variant="body2" color="textSecondary">
                  {lastMonthComments} Last month
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} p={1}>
          <Paper elevation={4}>
            <Box p={2}>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Total Posts
                  </Typography>
                  <Typography variant="h4">{totalPosts}</Typography>
                </Box>
                <HiDocumentText size={40} />
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <HiArrowNarrowUp color="green" />
                <Typography variant="body2" color="textSecondary">
                  {lastMonthPosts} Last month
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box
        style={{
          width: "100%",
          paddingTop: "16px",
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Typography>
              <Box p={2}>
                <Box
                  display="flex"
                  marginBottom="16px"
                  justifyContent="space-between"
                >
                  <Typography variant="h6">Recent Users</Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setValue(3);
                    }}
                  >
                    See all
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell size="string">User Image</TableCell>
                        <TableCell size="string">Username</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users &&
                        users.map((user) => (
                          <TableRow hover key={user._id}>
                            <TableCell size="string">
                              <img
                                src={user.profilePicture}
                                alt="user"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                }}
                              />
                            </TableCell>
                            <TableCell>{user.username}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>
              <Box p={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  marginBottom="16px"
                >
                  <Typography variant="h6">Recent Comments</Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setValue(4);
                    }}
                  >
                    See all
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Comment Content</TableCell>
                        <TableCell>Likes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {comments &&
                        comments.map((comment) => (
                          <TableRow hover key={comment._id}>
                            <TableCell>{comment.content}</TableCell>
                            <TableCell>{comment.numberOfLikes}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ paddingTop: "16px" }}>
          <Grid item xs={12} md={12}>
            <Typography>
              <Box p={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  marginBottom="16px"
                >
                  <Typography variant="h6">Recent Posts</Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setValue(2);
                    }}
                  >
                    See all
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Post Image</TableCell>
                        <TableCell>Post Title</TableCell>
                        <TableCell>Category</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {posts &&
                        posts.map((post) => (
                          <TableRow hover key={post._id}>
                            <TableCell component="th" scope="row">
                              <img
                                src={post.image}
                                alt="post"
                                style={{
                                  width: "56px",
                                  height: "40px",
                                  borderRadius: "4px",
                                  objectFit: "cover",
                                }}
                              />{" "}
                            </TableCell>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>{post.category}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
