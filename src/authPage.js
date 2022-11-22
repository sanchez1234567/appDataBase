import React, { useState } from "react";
import { Typography, Box, Grid, Stack, TextField, Button } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import CheckBox from "@mui/material/CheckBox";
import Item from "./item.js";
import { useData } from "./App.js";

export default function AuthPage() {
  //const { appSettings } = useData();
  const { setData } = useData();
  const { setAppSettings } = useData();
  const { switchToTreeFolder } = useData();

  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userSettings, setUserSettings] = useState();
  const [status, setStatus] = useState();

  let userData = {
    user: `${userName}`,
    password: `${userPassword}`,
  };

  const getUserSettings = async () => {
    const responseUserSettings = await fetch(
      `http://localhost:5000/${userData.user}Settings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    setStatus(responseUserSettings.status);
    const resultUserSettings = await responseUserSettings.json();
    setUserSettings(resultUserSettings);
    setAppSettings(resultUserSettings);
  };

  const getUserData = async () => {
    if (userSettings.AppSettings.v8i) {
      const responseUserData = await fetch(userSettings.AppSettings.v8i, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      setStatus(responseUserData.status);
      const resultUserData = await responseUserData.text();
      setData(resultUserData);
    }
  };

  const openTree = async () => {
    await getUserData();
    if (status) {
      switchToTreeFolder();
    }
  };

  const getUserName = (e) => {
    setUserName(e.target.value);
  };

  const getUserPassword = (e) => {
    setUserPassword(e.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 3 }}>
      <Grid item align={"center"}>
        <Item sx={{ boxShadow: 0 }}>
          <Typography variant="h6">
            {status === 401
              ? "Проверьте имя пользователя или пароль"
              : "Выполните вход"}
          </Typography>
        </Item>
      </Grid>
      <Grid item mt={0} align={"center"}>
        <Item sx={{ boxShadow: 0 }}>
          <Stack sx={{ width: "100%" }} spacing={2}>
            <TextField
              size="small"
              label="Имя пользователя"
              onChange={getUserName}
            ></TextField>
            <TextField
              size="small"
              label="Пароль"
              onChange={getUserPassword}
            ></TextField>
          </Stack>
        </Item>
      </Grid>
      <Grid container spacing={1} sx={{ width: "100%" }} mt={2.5}>
        <Grid item xs={6}>
          <Item sx={{ boxShadow: 0 }}>
            <FormControlLabel control={<CheckBox />} label="Запомнить меня" />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item sx={{ boxShadow: 0 }}>
            <Button
              variant="contained"
              size="medium"
              fullWidth={true}
              onClick={getUserSettings}
              sx={{ borderRadius: 0 }}
              disabled={
                userName.length > 0 && userPassword.length > 0 ? false : true
              }
            >
              Проверка
            </Button>
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item sx={{ boxShadow: 0 }}>
            <Button
              variant="contained"
              size="medium"
              fullWidth={true}
              onClick={openTree}
              sx={{ borderRadius: 0 }}
              disabled={status === 200 ? false : true}
            >
              Войти
            </Button>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
