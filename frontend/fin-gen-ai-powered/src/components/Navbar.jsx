import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  if (!user) return null;

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#0b3c5d" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

          {/* LEFT – PROFILE AVATAR WITH DROPDOWN */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ cursor: "pointer" }}
            onClick={handleAvatarClick}
          >
            <Avatar sx={{ bgcolor: "#1976d2" }}>
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="caption">
                ASM L2 Engineer
              </Typography>
            </Box>
          </Box>

          {/* PROFILE MENU */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                navigate("/profile");
              }}
            >
              Profile
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleCloseMenu();
                setLogoutOpen(true);
              }}
            >
              Logout
            </MenuItem>
          </Menu>

          {/* CENTER – MAIN NAVIGATION */}
          <Box display="flex" gap={2}>
            <Button color="inherit" onClick={() => navigate("/")}>
              Home
            </Button>

            <Button color="inherit" onClick={() => navigate("/knowledgehub")}>
              Knowledge Hub
            </Button>

            <Button color="inherit" onClick={() => navigate("/chatbot")}>
              Chatbot
            </Button>

            <Button color="inherit" onClick={() => navigate("/assessment")}>
              Assessment
            </Button>

            {user.role === "admin" && (
              <Button color="inherit" onClick={() => navigate("/admin")}>
                Admin
              </Button>
            )}
          </Box>

          {/* RIGHT – EMPTY (CLEAN UI) */}
          <Box />
        </Toolbar>
      </AppBar>

      {/* LOGOUT CONFIRMATION */}
      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)}>
        <DialogTitle>
          Are you sure you want to logout?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setLogoutOpen(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
