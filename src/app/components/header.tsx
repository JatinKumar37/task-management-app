'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";

export default function Header() {
  
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("storedUser", storedUser)
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []); 

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    console.log("Signed out");
    setAnchorEl(null);  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/">MyApp</Link>
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Link href="/dashboard">
            <Button color="inherit">Dashboard</Button>
          </Link>
          {currentUser?.role !== "Employee" && (
            <Link href="/users">
              <Button color="inherit">Users</Button>
            </Link>
          )}
        </Box>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          onClick={handleMenuOpen}
        >
          <Avatar alt="User Avatar" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
