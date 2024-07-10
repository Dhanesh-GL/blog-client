import ReactQuill from "react-quill";
import Alert from "@mui/material/Alert";
import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import Input from "../components/Input";
import "react-quill/dist/quill.snow.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/post/getposts?postId=${postId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/post/updatepost/${
          formData._id
        }/${currentUser._id}`,
        {
          method: "PUT",
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  const handleChange = (event) => {
    setFormData({ ...formData, category: event.target.value });
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  return (
    <Paper className="create-post-container">
      <form
        className="create-post-form"
        style={{ maxWidth: "750px", padding: "14px" }}
        onSubmit={handleSubmit}
      >
        <h1 className="create-post-title">Update post</h1>

        <Grid container spacing={2} >
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="text"
              label="Title"
              id="outlined-size-small"
              size="small"
              required
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              sx={{ marginRight: 1 }}
              value={formData.title}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small-label">Category</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Category"
                defaultValue={"uncategorized"}
                onChange={handleChange}
              >
                <MenuItem value="uncategorized">Select a category</MenuItem>
                <MenuItem value="reactjs">React.js</MenuItem>
                <MenuItem value="nextjs">Next.js</MenuItem>
                <MenuItem value="javascript">JavaScript</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div className="upload-section">
          <Input onFileChange={handleFileChange} />

          <Button
            variant="contained"
            size="small"
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="upload-progress">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert severity="error">{imageUploadError}</Alert>}
        {formData.image && (
          <img src={formData.image} alt="upload" className="uploaded-image" />
        )}
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Write something..."
          className="quill-editor"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button variant="contained" size="small" type="submit">
          Update post
        </Button>
        {publishError && <Alert severity="error">{publishError}</Alert>}
      </form>
    </Paper>
  );
}
