import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Box, Button, TextField, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/post/getposts?${searchQuery}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.name === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.name === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.name === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/post/getposts?${searchQuery}`,
      {
        credentials: "include",
      }
    );
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };
  const sortOption = [
    {
      value: "desc",
      label: "Latest",
    },
    {
      value: "asc",
      label: "Oldest",
    },
  ];
  const CategoryOption = [
    {
      value: "uncategorized",
      label: "Uncategorized",
    },
    {
      value: "reactjs",
      label: "React.js",
    },
    {
      value: "nextjs",
      label: "Next.js",
    },
    {
      value: "javascript",
      label: "JavaScript",
    },
  ];

  return (
    <Grid container minHeight={"calc(100vh - 69px)"}>
      <Grid
        item
        xs={12}
        sm={4}
        md={3}
        sx={{
          bgcolor: "background.default",
          height: {
            xs: "100%",
            sm: "calc(100vh - 69px)",
            md: "calc(100vh - 69px)",
          },
        }}
      >
        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          <div>
            <TextField
              margin="normal"
              type="text"
              label="Search..."
              name="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
              size="small"
              fullWidth
            />
          </div>
          <TextField
            margin="normal"
            size="small"
            fullWidth
            name="sort"
            select
            label="Sort"
            onChange={handleChange}
            value={sidebarData.sort}
          >
            {sortOption.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            size="small"
            fullWidth
            name="category"
            select
            label="Category"
            onChange={handleChange}
            value={sidebarData.category}
          >
            {CategoryOption.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            sx={{ margin: "10px 0px 4px 0px" }}
            type="submit"
            outline
            variant="contained"
          >
            Apply Filters
          </Button>
        </form>
      </Grid>
      <Grid
        item
        xs={12}
        md={9}
        sm={8}
        style={{
          height: "calc(100vh - 69px)",
          overflowY: "auto",
          "-ms-overflow-style": "none",
          scrollbarWidth: "none",
        }}
      >
        <Box padding={4}>
          {!loading && posts.length === 0 && (
            <Typography>No posts found.</Typography>
          )}
          {loading && <Typography>Loading...</Typography>}

          <Grid container spacing={3} sx={{ flexGrow: 1 }}>
            {!loading &&
              posts &&
              posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                  <PostCard post={post} />
                </Grid>
              ))}
          </Grid>

          {showMore && (
            <Button variant="contained" onClick={handleShowMore}>
              Show More
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
