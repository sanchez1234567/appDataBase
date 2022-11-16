import React, { useState } from "react";
import { Typography, Box, Grid, Stack, TextField, Button } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import CheckBox from "@mui/material/CheckBox";
import Item from "./item.js";
import { useData } from "./App.js";

export default function AuthPage() {
  const { setVisibleTreeFolder } = useData();
  const { setVisibleAuth } = useData();
  const { setVisibleAppBar } = useData();
  const { appSettings } = useData();
  const { setData } = useData();

  const renderTreeFolderPage = () => {
    setVisibleTreeFolder(true);
    setVisibleAuth(false);
    setVisibleAppBar(true);
  };

  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [status, setStatus] = useState();

  let userData = {
    user: `${userName}`,
    password: `${userPassword}`,
  };

  const getFetchStatus = async () => {
    const response = await fetch(appSettings.AppSettings.v8i, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.text();
    setStatus(response.status);
    setData(result);
  };

  const getUserName = (e) => {
    setUserName(e.target.value);
  };

  const getUserPassword = (e) => {
    setUserPassword(e.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 5 }}>
      <Grid item align={"center"}>
        <Item sx={{ boxShadow: 0 }}>
          <Typography variant="h5">Выполните вход</Typography>
        </Item>
      </Grid>
      <Grid item mt={1} align={"center"}>
        <Item sx={{ boxShadow: 0 }}>
          <Typography variant="h8">
            {status === 401 ? "Проверьте имя пользователя или пароль" : " "}
          </Typography>
        </Item>
      </Grid>
      <Grid item mt={3} align={"center"}>
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
              onClick={() => {
                getFetchStatus();
              }}
              sx={{ borderRadius: 1 }}
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
              onClick={renderTreeFolderPage}
              sx={{ borderRadius: 1 }}
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
