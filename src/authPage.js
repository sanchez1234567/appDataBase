import React, { useState } from "react";
import { Typography, Box, Grid, Stack, TextField, Button } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import CheckBox from "@mui/material/CheckBox";
import Item from "./Item.js";
import { useData } from "./App.js";

export default function AuthPage() {
  const { appSettings } = useData();
  const { setData } = useData();
  const { userName } = useData();
  const { setUserName } = useData();
  const { userPassword } = useData();
  const { setUserPassword } = useData();
  const { setAppSettings } = useData();
  const { switchToTreeFolder } = useData();
  const { setVisibleAuth } = useData();
  const { setOpenDialog } = useData();
  const { setServerErr } = useData();
  const { setSettingsErr } = useData();
  const { setDataErr } = useData();
  const { setHeader } = useData();
  const { setOpenInNew } = useData();
  const { setTreeView } = useData();
  const { setLastSelect } = useData();
  const { setSelectedNodes } = useData();
  const { setSortAZ } = useData();

  const [title, setTitle] = useState("Выполните вход");

  let user = {
    name: userName,
    password: userPassword,
  };

  const getUserSettings = async () => {
    try {
      const responseUserSettings = await fetch(
        `http://localhost:5000/${user.name}Settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      if (responseUserSettings.ok) {
        const resultUserSettings = await responseUserSettings.json();
        await setAppSettings(resultUserSettings);
        await localStorage.setItem(
          `${user.name}Settings`,
          JSON.stringify(resultUserSettings)
        );
        await setOpenInNew(resultUserSettings.UserSettings.Settings.OpenInNew);
        await setTreeView(resultUserSettings.UserSettings.Settings.TreeView);
        await setLastSelect(
          resultUserSettings.UserSettings.Settings.LastSelect[0]
        );
        await setSelectedNodes(
          resultUserSettings.UserSettings.Settings.LastSelect[1]
        );
        await setSortAZ(resultUserSettings.UserSettings.Settings.SortAZ);
        await getUserData();
      }
      if (!responseUserSettings.ok && responseUserSettings.status === 404) {
        throw new Error("404");
      }
      if (!responseUserSettings.ok && responseUserSettings.status === 401) {
        throw new Error("401");
      }
    } catch (err) {
      handleErrSettings(err);
    }
  };

  const handleErrSettings = async (fetchUserSet) => {
    if (String(fetchUserSet).includes("Failed to fetch")) {
      if (localStorage.getItem(`${user.name}Settings`) === null) {
        setVisibleAuth(false);
        setOpenDialog(false);
        setServerErr(true);
      }
      if (localStorage.getItem(`${user.name}Settings`) !== null) {
        await setAppSettings(
          JSON.parse(localStorage.getItem(`${user.name}Settings`))
        );
        await getUserData();
      }
    }
    if (String(fetchUserSet).includes("401")) {
      setTitle("Неверное имя пользователя или пароль");
    }
    if (String(fetchUserSet).includes("404")) {
      setVisibleAuth(false);
      setOpenDialog(false);
      setSettingsErr(true);
    }
  };

  const getUserData = async () => {
    try {
      const responseUserData = await fetch(appSettings.AppSettings.v8i, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (responseUserData.ok) {
        const resultUserData = await responseUserData.text();
        await setData(resultUserData);
        await localStorage.setItem(`${user.name}Data`, resultUserData);
        await switchToTreeFolder();
      }
      if (!responseUserData.ok && responseUserData.status === 404) {
        throw new Error("404");
      }
      if (!responseUserData.ok && responseUserData.status === 401) {
        throw new Error("401");
      }
    } catch (err) {
      handleErrData(err);
    }
  };

  const handleErrData = async (fetchUserData) => {
    if (String(fetchUserData).includes("Failed to fetch")) {
      if (localStorage.getItem(`${user.name}Data`) === null) {
        await setVisibleAuth(false);
        await setOpenDialog(false);
        await setServerErr(true);
      }
      if (localStorage.getItem(`${user.name}Data`) !== null) {
        // эта часть кода не выолняется
        await setOpenInNew(appSettings.UserSettings.Settings.OpenInNew);
        await setTreeView(appSettings.UserSettings.Settings.TreeView);
        await setLastSelect(appSettings.UserSettings.Settings.LastSelect[0]);
        await setSelectedNodes(appSettings.UserSettings.Settings.LastSelect[1]);
        await setSortAZ(appSettings.UserSettings.Settings.SortAZ);
        // до этой строчки
        await setData(localStorage.getItem(`${user.name}Data`));
        await switchToTreeFolder();
        await setHeader("Список баз");
      }
    }
    if (String(fetchUserData).includes("401")) {
      setTitle("Неверное имя пользователя или пароль");
    }
    if (String(fetchUserData).includes("404")) {
      await setVisibleAuth(false);
      await setOpenDialog(false);
      await setDataErr(true);
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
          <Typography variant="h6">{title}</Typography>
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
        <Grid item xs={2}>
          <Item sx={{ boxShadow: 0 }}></Item>
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
              Войти
            </Button>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
