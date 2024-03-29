import React, { useState } from "react";
import { Typography, Box, Grid, Stack, TextField } from "@mui/material";
import { IconButton } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Item from "./Item.js";
import CloseIcon from "@mui/icons-material/Close";
import { useData } from "./App.js";

export default function AuthPage() {
  const { setSettingsObj } = useData();
  const { setData } = useData();
  const { setUserName } = useData();
  const { setUserPassword } = useData();
  const { setAppSettings } = useData();
  const { switchToTreeFolder } = useData();
  const { setVisible } = useData();
  const { setOpenDialog } = useData();
  const { setHeader } = useData();
  const { currentUser } = useData();
  const { setIsOnline } = useData();
  const { setIsOnlineIcon } = useData();
  const { setOpenSnackB } = useData();
  const { setSnackBMes } = useData();

  const [title, setTitle] = useState("Выполните вход");
  const [loadStatus, setLoadStatus] = useState(false);

  const getUserSettings = async () => {
    setLoadStatus(true);
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
        setSettingsObj((prevSet) => {
          return {
            ...prevSet,
            openInNew: resultUserSettings.UserSettings.Settings.OpenInNew,
          };
        });
        setSettingsObj((prevSet) => {
          return {
            ...prevSet,
            treeView: resultUserSettings.UserSettings.Settings.TreeView,
          };
        });
        setSettingsObj((prevSet) => {
          return {
            ...prevSet,
            lastSelect: resultUserSettings.UserSettings.Settings.LastSelect[0],
          };
        });
        setSettingsObj((prevSet) => {
          return {
            ...prevSet,
            selectedNode:
              resultUserSettings.UserSettings.Settings.LastSelect[1],
          };
        });
        setSettingsObj((prevSet) => {
          return {
            ...prevSet,
            sortAZ: resultUserSettings.UserSettings.Settings.SortAZ,
          };
        });
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
        setVisible((obj) => {
          return { ...obj, cAuth: false };
        });
        setOpenDialog(false);
        setSnackBMes("Сервер MiBase не отвечает. Свяжитесь с поддержкой.");
        setOpenSnackB(true);
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
      setLoadStatus(false);
    }
    if (String(errUserSet).includes("404")) {
      setVisible((obj) => {
        return { ...obj, cAuth: false };
      });
      setOpenDialog(false);
      setSnackBMes("Файл настроек MiBase не найден. Свяжитесь с поддержкой.");
      setOpenSnackB(true);
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
        setIsOnline(`${currentUser.name} (онлайн)`);
        setIsOnlineIcon(true);
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
        setVisible((obj) => {
          return { ...obj, cAuth: false };
        });
        setOpenDialog(false);
        setSnackBMes("Сервер MiBase не отвечает. Свяжитесь с поддержкой.");
        setOpenSnackB(true);
      }
      if (localStorage.getItem(`${currentUser.name}Data`) !== null) {
        setSettingsObj((prevSet) => {
          return {
            ...prevSet,
            openInNew: localUserSet.UserSettings.Settings.OpenInNew,
          };
        });
        setSettingsObj((prevSet) => {
          return {
            ...prevSet,
            treeView: localUserSet.UserSettings.Settings.TreeView,
          };
        });
        setSettingsObj((prevSet) => {
          return {
            ...prevSet,
            lastSelect: localUserSet.UserSettings.Settings.LastSelect[0],
          };
        });
        setSettingsObj((prevSet) => {
          return {
            ...prevSet,
            selectedNode: localUserSet.UserSettings.Settings.LastSelect[1],
          };
        });
        setSettingsObj((prevSet) => {
          return {
            ...prevSet,
            sortAZ: localUserSet.UserSettings.Settings.SortAZ,
          };
        });
        setData(localStorage.getItem(`${currentUser.name}Data`));
        setIsOnline(`${currentUser.name} (оффлайн)`);
        setIsOnlineIcon(false);
        switchToTreeFolder();
        setHeader("Список баз");
        setLoadStatus(false);
      }
    }
    if (String(errUserData).includes("401")) {
      setTitle("Неверное имя пользователя или пароль");
      setLoadStatus(false);
    }
    if (String(errUserData).includes("404")) {
      setVisible((obj) => {
        return { ...obj, cAuth: false };
      });
      setOpenDialog(false);
      setSnackBMes("Список баз MiBase не найден. Свяжитесь с поддержкой.");
      setOpenSnackB(true);
    }
  };

  const getUserName = (e) => {
    setUserName(e.target.value);
  };

  const getUserPassword = (e) => {
    setUserPassword(e.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 0 }}>
      <IconButton
        sx={{ ml: 61 }}
        onClick={() => {
          setOpenDialog(false);
        }}
      >
        <CloseIcon />
      </IconButton>
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
          <Item sx={{ boxShadow: 0 }}></Item>
        </Grid>
        <Grid item xs={2}>
          <Item sx={{ boxShadow: 0 }}></Item>
        </Grid>
        <Grid item xs={3}>
          <Item sx={{ boxShadow: 0 }}>
            <LoadingButton
              variant="contained"
              size="medium"
              loading={loadStatus}
              fullWidth={true}
              onClick={getUserSettings}
              sx={{ borderRadius: 1 }}
              disabled={
                currentUser["name"].length > 0 &&
                currentUser["password"].length > 0
                  ? false
                  : true
              }
            >
              Войти
            </LoadingButton>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
