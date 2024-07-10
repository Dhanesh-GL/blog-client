import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";
import { Link, useLocation } from "react-router-dom";
import { MdAdminPanelSettings } from "react-icons/md";

import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Grid, useTheme } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const location = useLocation();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [selected, setSelected] = useState("Profile");
  const handleSignout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/user/signout`,
        {
          method: "POST",
          credentials: "include",
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
  const theme = useTheme();

  return (
    <Grid
      container
      sx={{
        bgcolor: "background.paper",
        display: "flex",
      }}
    >
      <Grid item xs={12} sm={4} md={2}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{
            borderRight: 1,
            borderColor: "divider",
            height: {
              xs: "100%",
              sm: "calc(100vh - 69px)",
              md: "calc(100vh - 69px)",
            },
          }}
        >
          <Tab
            componnent={Link}
            to="/dashboard?tab=profile"
            {...a11yProps(1)}
            sx={{
              justifyContent: "start",
              display: "flex",
              "&.Mui-selected": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900], // Selected background color
              },
            }}
            icon={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {currentUser.isAdmin ? (
                  <MdAdminPanelSettings style={{ fontSize: 30 }} />
                ) : (
                  <HiUser style={{ fontSize: 30 }} />
                )}
                <Typography sx={{ marginLeft: 1 }}>Profile</Typography>
              </Box>
            }
          />

          {currentUser && currentUser.isAdmin && (
            <Tab
              componnent={Link}
              to="/dashboard?tab=dashboard"
              {...a11yProps(1)}
              sx={{
                justifyContent: "start",
                display: "flex",
                "&.Mui-selected": {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900], // Selected background color
                },
              }}
              icon={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <HiChartPie style={{ fontSize: 30 }} />
                  <Typography sx={{ marginLeft: 1 }}>Dashboard</Typography>
                </Box>
              }
            />
          )}

          {currentUser.isAdmin && (
            <Tab
              componnent={Link}
              to="/dashboard?tab=posts"
              {...a11yProps(1)}
              sx={{
                justifyContent: "start",
                display: "flex",
                "&.Mui-selected": {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900], // Selected background color
                },
              }}
              icon={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <HiDocumentText style={{ fontSize: 30 }} />
                  <Typography sx={{ marginLeft: 1 }}>Posts</Typography>
                </Box>
              }
            />
          )}

          {currentUser.isAdmin && (
            <Tab
              componnent={Link}
              to="/dashboard?tab=users"
              {...a11yProps(1)}
              sx={{
                justifyContent: "start",
                display: "flex",
                "&.Mui-selected": {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900], // Selected background color
                },
              }}
              icon={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <HiOutlineUserGroup style={{ fontSize: 30 }} />
                  <Typography sx={{ marginLeft: 1 }}>Users</Typography>
                </Box>
              }
            />
          )}

          {currentUser.isAdmin && (
            <Tab
              componnent={Link}
              to="/dashboard?tab=comments"
              {...a11yProps(1)}
              sx={{
                justifyContent: "start",
                display: "flex",
                "&.Mui-selected": {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900], // Selected background color
                },
              }}
              icon={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <HiAnnotation style={{ fontSize: 30 }} />
                  <Typography sx={{ marginLeft: 1 }}>Comments</Typography>
                </Box>
              }
            />
          )}

          <Tab
            onClick={() => {
              setSelected("Sign Out");
              handleSignout();
            }}
            {...a11yProps(1)}
            sx={{
              justifyContent: "start",
              display: "flex",
              "&.Mui-selected": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900], // Selected background color
              },
            }}
            icon={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <HiArrowSmRight style={{ fontSize: 30 }} />
                <Typography sx={{ marginLeft: 1 }}>Sign Out</Typography>
              </Box>
            }
          />
        </Tabs>
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={10}
        style={{
          height: "calc(100vh - 69px)",
          overflowY: "auto",
          "-ms-overflow-style": "none",
          scrollbarWidth: "none",
        }}
      >
        <TabPanel value={value} index={0}>
          <DashProfile />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <DashboardComp setValue={setValue} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <DashPosts />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <DashUsers />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <DashComments />
        </TabPanel>
        <TabPanel value={value} index={5}>
          Item Six
        </TabPanel>
      </Grid>
    </Grid>
  );
}
