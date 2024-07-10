import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";

export default function App() {
  const dark = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const light = createTheme({
    palette: {
      mode: "light",
    },
  });
  const [mode, setMode] = useState("dark");

  return (
    <ThemeProvider theme={mode === "dark" ? dark : light}>
      <BrowserRouter>
        <ScrollToTop />
        <Header mode={mode} setMode={setMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>

          <Route path="/post/:postSlug" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
