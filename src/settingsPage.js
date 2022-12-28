import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Switch, Grid, Backdrop, CircularProgress } from "@mui/material";
import Item from "./Item.js";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DoneIcon from "@mui/icons-material/Done";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import { useData } from "./App.js";
import SendNewSettings from "./functions/SendNewSettings.js";

export default function SettingsPage() {
  const { appSettings } = useData();
  const { currentUserSet } = useData();
  const { settingsObj } = useData();
  const { setSettingsObj } = useData();

  const [localOpenInNew, setLocalOpenInNew] = useState(settingsObj.openInNew);
  const switchOpenInNew = (event) => {
    setLocalOpenInNew(event.target.checked);
    setCancelButton("Отмена");
  };

  const [localTreeView, setLocalTreeView] = useState(settingsObj.treeView);
  const switchTreeView = (event) => {
    setLocalTreeView(event.target.checked);
    setCancelButton("Отмена");
  };

  const [localLastSelect, setLocalLastSelect] = useState(
    settingsObj.lastSelect
  );
  const switchLastSelect = (event) => {
    setLocalLastSelect(event.target.checked);
    setCancelButton("Отмена");
  };

  const [localSortAZ, setLocalSortAZ] = useState(settingsObj.sortAZ);
  const switchSortAZ = (event) => {
    setLocalSortAZ(event.target.checked);
    setCancelButton("Отмена");
  };

  const [cancelButton, setCancelButton] = useState("Отмена");
  const saveSwitchValues = () => {
    setBackDrop(true);
    setSettingsObj((prevSet) => {
      return {
        ...prevSet,
        openInNew: localOpenInNew,
      };
    });
    setSettingsObj((prevSet) => {
      return {
        ...prevSet,
        treeView: localTreeView,
      };
    });
    setSettingsObj((prevSet) => {
      return {
        ...prevSet,
        lastSelect: localLastSelect,
      };
    });
    setSettingsObj((prevSet) => {
      return {
        ...prevSet,
        sortAZ: localSortAZ,
      };
    });
    appSettings.UserSettings.Settings.OpenInNew = localOpenInNew;
    appSettings.UserSettings.Settings.TreeView = localTreeView;
    appSettings.UserSettings.Settings.LastSelect["0"] = localLastSelect;
    appSettings.UserSettings.Settings.SortAZ = localSortAZ;
    SendNewSettings(currentUserSet)
      .then(() => setBackDrop(false))
      .then(() => setCancelButton("Назад"));
  };

  const { undoPage } = useData();
  const { auth } = useData();
  const { backDrop } = useData();
  const { setBackDrop } = useData();

  const renderLine = (icon, text, marTop, switchValue, handleSwitch) => {
    return (
      <Grid
        container
        spacing={1}
        sx={{
          width: "100%",
          align: "center",
          justifyContent: "center",
          mt: marTop,
        }}
      >
        <Grid item xs={2} align={"center"}>
          <Item sx={{ border: 0, boxShadow: 0 }}>{icon}</Item>
        </Grid>
        <Grid item xs={7}>
          <Item sx={{ border: 0, boxShadow: 0 }}>
            <Typography variant="body1">{text}</Typography>
          </Item>
        </Grid>
        <Grid item xs={3} align={"center"}>
          <Item sx={{ border: 0, boxShadow: 0 }}>
            <Switch
              checked={switchValue}
              onChange={handleSwitch}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Item>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 1, ml: 1.2 }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDrop}
      >
        <CircularProgress color="primary" size="1.5rem" />
        <Typography variant="h6" sx={{ ml: 1 }}>
          сохрание настроек...
        </Typography>
      </Backdrop>
      <Box
        sx={{
          boxShadow: 0,
          border: 1,
          borderRadius: 1,
          height: 330,
          maxWidth: 510,
        }}
      >
        {renderLine(
          <OpenInNewIcon />,
          "Открыть в новой вкладке",
          4,
          localOpenInNew,
          switchOpenInNew
        )}
        {renderLine(
          <FormatListBulletedIcon />,
          "Отображать в виде списка",
          0,
          localTreeView,
          switchTreeView
        )}
        {renderLine(
          <DoneIcon />,
          "Запомнить последний выбор",
          0,
          localLastSelect,
          switchLastSelect
        )}
        {renderLine(
          <SortByAlphaIcon />,
          "Сортировка по имени",
          0,
          localSortAZ,
          switchSortAZ
        )}
      </Box>
      <Box>
        <Grid container sx={{ mt: 1.5 }}>
          <Grid item xs={6}>
            <Item sx={{ boxShadow: 0 }}></Item>
          </Grid>
          <Grid item xs={3}>
            <Item sx={{ boxShadow: 0 }}>
              <Button
                variant="contained"
                size="medium"
                fullWidth={true}
                sx={{ borderRadius: 1 }}
                onClick={saveSwitchValues}
                disabled={auth ? false : true}
              >
                Сохранить
              </Button>
            </Item>
          </Grid>
          <Grid item xs={3}>
            <Item sx={{ boxShadow: 0 }}>
              <Button
                variant="contained"
                size="medium"
                fullWidth={true}
                onClick={undoPage}
                sx={{ borderRadius: 1 }}
              >
                {cancelButton}
              </Button>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
