import moment from "moment";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, TextField, Typography } from "@mui/material";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/user/${comment.userId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/comment/editComment/${
          comment._id
        }`,
        {
          method: "PUT",
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editedContent,
          }),
        }
      );
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="comment-container">
      <div className="profile-picture">
        <img
          className="profile-img"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="comment-content">
        <div className="comment-header">
          <span className="username">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="small">{moment(comment.createdAt).fromNow()}</span>
        </div>
        {isEditing ? (
          <>
            <div>
              <TextField
                label="Edit"
                id="outlined-size-small"
                size="small"
                fullWidth
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                sx={{ m: 1 }}
              />
            </div>

            <div className="edit-buttons">
              <Button size="small" variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <Typography className="comment-text">{comment.content}</Typography>
            <div className="comment-actions">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`like-button ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "liked"
                }`}
              >
                <FaThumbsUp className="like-icon" />
              </button>
              <Typography className="like-count">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </Typography>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(comment._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
