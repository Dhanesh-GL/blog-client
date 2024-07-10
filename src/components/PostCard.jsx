import { Link } from "react-router-dom";

import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function PostCard({ post }) {
  return (
    <Card >
      <Link to={`/post/${post.slug}`}>
        <CardMedia sx={{ height: 140 }} image={post.image} title="post cover" />
      </Link>

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}{" "}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.category}
        </Typography>
      </CardContent>
      <CardActions sx={{display:'flex', justifyContent:"center"}}>
        <Link to={`/post/${post.slug}`} >
          <Button sx={{mb:2}} size="small" variant="contained">
            Read article
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
