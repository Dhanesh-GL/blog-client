import Alert from "@mui/material/Alert";
import SaveIcon from "@mui/icons-material/Save";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";

import Modall from "./Modal";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/user/update/${currentUser._id}`,
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
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/user/signout`,
        {
          method: "POST",
          credentials: 'include',

        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const [open, setOpen] = useState(false);

  return (
    <div className="profile-container">
      <div style={{ width: "500px" }}>
        <form onSubmit={handleSubmit} className="profile-form">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
      <div
  className="custom-profile-container"
  onClick={() => filePickerRef.current.click()}
>
  {imageFileUploadProgress && (
    <CircularProgressbar
      value={imageFileUploadProgress || 0}
      text={`${imageFileUploadProgress}%`}
      strokeWidth={5}
      styles={{
        root: {
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        },
        path: {
          stroke: `rgba(62, 152, 199, ${
            imageFileUploadProgress / 100
          })`,
        },
      }}
    />
  )}
  <img
    src={imageFileUrl || currentUser.profilePicture}
    alt="user"
    style={{ margin: "0px", padding: "0px" }}
    className={`custom-profile-image ${
      imageFileUploadProgress &&
      imageFileUploadProgress < 100 &&
      "custom-image-uploading"
    }`}
  />
</div>

          {imageFileUploadError && (
            <Alert color="failure">{imageFileUploadError}</Alert>
          )}

          <TextField
            type="text"
            label="User name"
            id="username"
            size="small"
            fullWidth
            defaultValue={currentUser.username}
            onChange={handleChange}
            className="text-field"
          />

          <TextField
          disabled={true}
            type="email"
            id="email"
            size="small"
            fullWidth
            defaultValue={currentUser.email}
            onChange={handleChange}
            className="text-field"
          />
          <TextField
            type="password"
            label="Password"
            id="password"
            size="small"
            fullWidth
            onChange={handleChange}
            className="text-field"
          />

          <LoadingButton
            color="secondary"
            type="submit"
            loading={loading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
          >
            <span>Save</span>
          </LoadingButton>
          {currentUser.isAdmin && (
            <Link to={"/create-post"}>
              <Button fullWidth variant="contained">
                Create a post
              </Button>
            </Link>
          )}
        </form>
        <div className="profile-actions">
          <span onClick={() => setOpen(true)} className="profile-action">
            Delete Account
          </span>
          <span onClick={handleSignout} className="profile-action">
            Sign Out
          </span>
        </div>
        {updateUserSuccess && (
          <Alert color="success" className="profile-alert">
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color="failure" className="profile-alert">
            {updateUserError}
          </Alert>
        )}
        {error && <Alert severity="error"> {error}</Alert>}
      </div>
      <Modall
        open={open}
        setOpen={setOpen}
        agree={() => handleDeleteUser()}
      ></Modall>
    </div>
  );
}
