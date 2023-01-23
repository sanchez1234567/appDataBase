import React, { useState } from "react";
import { Box, Grid, Typography, Button, TextField } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import Item from "./Item.js";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useData } from "./App.js";

export default function SupportPage() {
  const { appSettings } = useData();
  const { auth } = useData();
  const { currentUser } = useData();

  const [userMessage, setUserMessage] = useState();
  let user = {
    name: currentUser.name,
    password: currentUser.password,
    message: userMessage,
  };

  const [backDropOpen, setBackDropOpen] = useState(false);
  const [backDropText, setBackDropText] = useState("");
  const [backDropIcon, setBackDropIcon] = useState([]);
  const [enableHandleClose, setEnableHandleClose] = useState(false);

  const handleCloseBackDrop = () => {
    setBackDropOpen(false);
  };

  const sendUserMessage = async () => {
    setBackDropIcon(<CircularProgress color="primary" size="1.5rem" />);
    setBackDropOpen(true);
    setBackDropText("отправка сообщения");
    try {
      const sendFetch = await fetch(
        appSettings.UserSettings.Help.HelpMessage.address,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/html",
          },
          body: JSON.stringify(user),
        }
      );
      if (sendFetch.ok) {
        setUserMessage("");
        setBackDropIcon(<DoneIcon color="success" fontSize="large" />);
        setBackDropText("сообщение отправлено");
        setEnableHandleClose(true);
      }
      if (
        !sendFetch.ok &&
        (sendFetch.status === 400 || sendFetch.status === 401)
      ) {
        throw new Error("Failed to fetch");
      }
    } catch (err) {
      setUserMessage("");
      setBackDropIcon(
        <ErrorOutlineIcon sx={{ color: "#f44336" }} fontSize="large" />
      );
      setBackDropText("сообщение не отправлено");
      setEnableHandleClose(true);
    }
  };

  const getUserMessage = (e) => {
    setUserMessage(e.target.value);
  };

  return (
    <Box mt={2} ml={2} mr={2}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropOpen}
        onClick={enableHandleClose ? handleCloseBackDrop : null}
      >
        {backDropIcon}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {backDropText}
        </Typography>
      </Backdrop>
      <Grid container spacing={0} mt={1}>
        <Grid item xs={1}>
          <Item sx={{ boxShadow: 0 }}>
            <CallIcon />
          </Item>
        </Grid>
        <Grid item xs={7}>
          <Item sx={{ boxShadow: 0 }}>
            <Typography variant="body1">
              {appSettings.UserSettings.Help.tel}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={1}>
          <Item sx={{ boxShadow: 0 }}>
            <EmailIcon />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item sx={{ boxShadow: 0 }}>
            <Typography variant="body1">
              {appSettings.UserSettings.Help.email}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={1}>
          <Item sx={{ boxShadow: 0 }}>
            <LanguageIcon />
          </Item>
        </Grid>
        <Grid item xs={11}>
          <Item sx={{ boxShadow: 0 }}>
            <Typography variant="body1">
              {appSettings.UserSettings.Help.site}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item sx={{ boxShadow: 0 }}>
            <Box sx={{ height: 230, maxWidth: 510 }}>
              <TextField
                multiline
                rows={9}
                id="outlined-required"
                label="Сообщение в поддержку"
                value={userMessage}
                sx={{ width: 480 }}
                onChange={getUserMessage}
              ></TextField>
            </Box>
          </Item>
        </Grid>
        <Grid item xs={9}>
          <Item sx={{ boxShadow: 0 }}></Item>
        </Grid>
        <Grid item xs={3}>
          <Item sx={{ boxShadow: 0 }}>
            <Button
              variant="contained"
              size="medium"
              fullWidth={true}
              sx={{ borderRadius: 1 }}
              disabled={auth ? false : true}
              onClick={sendUserMessage}
            >
              отправить
            </Button>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
