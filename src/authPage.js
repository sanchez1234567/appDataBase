import React, { useState } from "react";
import { Typography, Box, Grid, Stack, TextField, Button } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import CheckBox from "@mui/material/CheckBox";
import Item from "./Item.js";
import { useData } from "./App.js";

export default function AuthPage() {
  const { setData } = useData();
  const { userName } = useData();
  const { setUserName } = useData();
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
  const { currentUser } = useData();
  const { setStatus } = useData();
  const { setIsOnline } = useData();

  const [title, setTitle] = useState("Выполните вход");

  const getUserSettings = async () => {
    try {
      const responseUserSettings = await fetch(
        `http://localhost:5000/${currentUser.name}Settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentUser),
        }
      );
      if (responseUserSettings.ok) {
        const resultUserSettings = await responseUserSettings.json();
        localStorage.setItem(
          `${currentUser.name}/${currentUser.password}Settings`,
          JSON.stringify(resultUserSettings)
        );
        setAppSettings(resultUserSettings);
        setOpenInNew(resultUserSettings.UserSettings.Settings.OpenInNew);
        setTreeView(resultUserSettings.UserSettings.Settings.TreeView);
        setLastSelect(resultUserSettings.UserSettings.Settings.LastSelect[0]);
        setSelectedNodes(
          resultUserSettings.UserSettings.Settings.LastSelect[1]
        );
        setSortAZ(resultUserSettings.UserSettings.Settings.SortAZ);
        getUserData(resultUserSettings);
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

  const handleErrSettings = async (errUserSet) => {
    if (String(errUserSet).includes("Failed to fetch")) {
      if (
        localStorage.getItem(
          `${currentUser.name}/${currentUser.password}Settings`
        ) === null
      ) {
        setVisibleAuth(false);
        setOpenDialog(false);
        setServerErr(true);
      }
      if (
        localStorage.getItem(
          `${currentUser.name}/${currentUser.password}Settings`
        ) !== null
      ) {
        const localUserSettings = await JSON.parse(
          localStorage.getItem(
            `${currentUser.name}/${currentUser.password}Settings`
          )
        );
        setAppSettings(localUserSettings);
        getUserData(localUserSettings);
      }
    }
    if (String(errUserSet).includes("401")) {
      setTitle("Неверное имя пользователя или пароль");
    }
    if (String(errUserSet).includes("404")) {
      setVisibleAuth(false);
      setOpenDialog(false);
      setSettingsErr(true);
    }
  };

  const getUserData = async (userSet) => {
    try {
      const responseUserData = await fetch(userSet.AppSettings.v8i, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentUser),
      });
      if (responseUserData.ok) {
        const resultUserData = await responseUserData.text();
        setData(resultUserData);
        localStorage.setItem(`${currentUser.name}Data`, resultUserData);
        setStatus(`${userName} (онлайн)`);
        setIsOnline(true);
        switchToTreeFolder();
      }
      if (!responseUserData.ok && responseUserData.status === 404) {
        throw new Error("404");
      }
      if (!responseUserData.ok && responseUserData.status === 401) {
        throw new Error("401");
      }
    } catch (err) {
      handleErrData(err, userSet);
    }
  };

  const handleErrData = (errUserData, localUserSet) => {
    if (String(errUserData).includes("Failed to fetch")) {
      if (localStorage.getItem(`${currentUser.name}Data`) === null) {
        setVisibleAuth(false);
        setOpenDialog(false);
        setServerErr(true);
      }
      if (localStorage.getItem(`${currentUser.name}Data`) !== null) {
        setOpenInNew(localUserSet.UserSettings.Settings.OpenInNew);
        setTreeView(localUserSet.UserSettings.Settings.TreeView);
        setLastSelect(localUserSet.UserSettings.Settings.LastSelect[0]);
        setSelectedNodes(localUserSet.UserSettings.Settings.LastSelect[1]);
        setSortAZ(localUserSet.UserSettings.Settings.SortAZ);
        setData(localStorage.getItem(`${currentUser.name}Data`));
        setStatus(`${userName} (оффлайн)`);
        setIsOnline(false);
        switchToTreeFolder();
        setHeader("Список баз");
      }
    }
    if (String(errUserData).includes("401")) {
      setTitle("Неверное имя пользователя или пароль");
    }
    if (String(errUserData).includes("404")) {
      setVisibleAuth(false);
      setOpenDialog(false);
      setDataErr(true);
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
                currentUser["name"].length > 0 &&
                currentUser["password"].length > 0
                  ? false
                  : true
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
