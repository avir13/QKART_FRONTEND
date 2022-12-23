import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, TextField } from "@mui/material";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userInfo = localStorage.getItem("username");
    if (userInfo) {
      setUserName(localStorage.getItem("username"));
      setUserLoggedIn(true);
    }
  }, [userLoggedIn]);

  const loggedOut = () => {
    window.location.replace("/");
    localStorage.clear();
    setUserLoggedIn(false);
  };

  return (
    <Box className="header">
      <Box 
        className="header-title"
        onClick={() => {
          history.push("/");
        }}
        >
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children && children}
      <Stack direction="row" spacing={1}>
        {!userLoggedIn && !hasHiddenAuthButtons && (
          <>
            <Button
              className="explore-button"
              variant="text"
              onClick={() => history.push("/login")}
            >
              Login
            </Button>
            <Button
              className="explore-button"
              variant="text"
              onClick={() => history.push("/register")}
            >
              Register
            </Button>
          </>
        )}
        {userLoggedIn && (
          <>
            <Avatar src="avatar.png" alt={userName} />
            <p className="username-text">{userName}</p>
            {/* <TextField 
              id="password"
              className="search-desktop"
              variant="outlined"
              label="search"
              name="search"
              placeholder="Search for items/categoriess"
            /> */}
            <Button
              className="explore-button"
              variant="text"
              onClick={loggedOut}
            >
              Logout
            </Button>
          </>
        )}
        {hasHiddenAuthButtons && (
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => history.push("/")}
          >
            Back to explore
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default Header;
