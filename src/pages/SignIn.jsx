import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import Alert from "@mui/material/Alert";
import { Box, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Paper from "@mui/material/Paper";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/signin`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <Paper
      className="profile-container"
      sx={{ height: "calc(100vh - 69px)", p: 0 }}
    >
      <Box style={{ width: "500px", padding: "30px" }}>
        <form onSubmit={handleSubmit} className="profile-form">
          <TextField
            type="email"
            label="Email"
            id="email"
            onChange={handleChange}
            size="small"
            fullWidth
          />
          <TextField
            type="password"
            label="Password"
            id="password"
            onChange={handleChange}
            size="small"
            fullWidth
          />

          <LoadingButton
            type="submit"
            loading={loading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
          >
            Sign In
          </LoadingButton>
          <div>
            {" "}
            <OAuth />
          </div>
        </form>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",            margin:"10px 0px"

          }}
        >
          <span >Don't have an account?</span>
          <Link to="/sign-up">Sign Up</Link>
        </div>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      </Box>
    </Paper>
  );
}
