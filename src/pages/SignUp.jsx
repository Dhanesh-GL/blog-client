import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Paper from "@mui/material/Paper";
import { Box, Button, TextField } from "@mui/material";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/signup`, {
        method: "POST",
        credentials: 'include',

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false)
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <Paper className="profile-container" sx={{ height: "calc(100vh - 69px)",p:0}}>
      <Box style={{ width: "500px",padding: "30px"  }}>
        <form className="profile-form" onSubmit={handleSubmit}>
          <TextField
            type="text"
            label="Username"
            id="username"
            size="small"
            onChange={handleChange}

            fullWidth
          />
          <TextField
            type="email"
            label="Email"
            id="email"
            size="small"
            fullWidth
            onChange={handleChange}
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
            <span> Sign Up</span>
          </LoadingButton>

          <OAuth />
        </form>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            margin:"10px 0px"
          }}
        >
          <span>Have an account?</span>
          <Link to="/sign-in" className="sign-in-link">
            Sign In
          </Link>
        </div>
        {errorMessage && <Alert severity="error"> {errorMessage}</Alert>}
      </Box>
    </Paper>
  );
}
