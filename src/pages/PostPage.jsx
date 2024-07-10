import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/post/getposts?slug=${postSlug}`,{
          credentials: 'include',

        });
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/post/getposts?limit=3`,{
          credentials: 'include',

        });
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  return (
    <Paper sx={{ width: "100%", minHeight: "calc(100vh - 69px)" }}>
      <Box className="main-container" p={4}>
        <h1 className="main-title">{post && post.title}</h1>
        <Link
          to={`/search?category=${post && post.category}`}
          className="category-link"
        >
          <Button variant="contained">{post && post.category}</Button>
        </Link>
        <img
          src={post && post.image}
          alt={post && post.title}
          className="main-image"
        />
        <div className="info-container">
          <span className="info-item">
            {post && new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span className="info-item">
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>

        <CommentSection postId={post._id} />
      </Box>
    </Paper>
  );
}
