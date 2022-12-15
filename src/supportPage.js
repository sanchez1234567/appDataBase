import React, { useState } from "react";
import { Box, Grid, Typography, Button, TextField } from "@mui/material";
import { Snackbar, IconButton } from "@mui/material";
import Item from "./Item.js";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import CloseIcon from "@mui/icons-material/Close";
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

  const [openSnack, setOpenSnack] = useState();
  const [messageOk, setMessageOk] = useState();
  const handleClose = () => {
    setOpenSnack(false);
  };

  const openSnackbar = () => {
    return (
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleClose}
        message={messageOk}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      ></Snackbar>
    );
  };

  const sendUserMessage = async () => {
    try {
      const sendFetch = await fetch(
        `http://localhost:5000/${user.name}Message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/html",
          },
          body: JSON.stringify(user),
        }
      );
      if (sendFetch.ok) {
        setMessageOk("Сообщение отправлено");
        setOpenSnack(true);
      }
      if (
        !sendFetch.ok &&
        (sendFetch.status === 400 || sendFetch.status === 401)
      ) {
        throw new Error("Failed to fetch");
      }
    } catch (err) {
      setMessageOk("Сообщение не отправлено");
      setOpenSnack(true);
    }
  };

  const getUserMessage = (e) => {
    setUserMessage(e.target.value);
  };

  return (
    <Box mt={2} ml={2} mr={2}>
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
                defaultValue=" "
                sx={{ width: 480 }}
                onChange={getUserMessage}
              ></TextField>
            </Box>
          </Item>
        </Grid>
        <Grid item xs={9}>
          <Item sx={{ boxShadow: 0 }}>{openSnackbar()}</Item>
        </Grid>
        <Grid item xs={3}>
          <Item sx={{ boxShadow: 0 }}>
            <Button
              variant="contained"
              size="medium"
              fullWidth={true}
              sx={{ borderRadius: 0 }}
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
