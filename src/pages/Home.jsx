import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/post/getPosts`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <Box sx={{ px: { xs: 3, sm: 6, md: 8 }, pb: 5 }}>
      {posts && posts.length > 0 && (
        <>
          <Typography variant="h4" component="h2" align="center" sx={{ my: 4 }}>
            Recent Posts
          </Typography>
          <Box>
            <Grid container spacing={3} sx={{ flexGrow: 1 }}>
              {posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                  <PostCard post={post} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
}
