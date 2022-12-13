import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Switch, Grid } from "@mui/material";
import Item from "./Item.js";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DoneIcon from "@mui/icons-material/Done";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import { useData } from "./App.js";
import SendNewSettings from "./functions/SendNewSettings.js";

export default function SettingsPage() {
  const { appSettings } = useData();
  const { selectedNodes } = useData();
  const { currentUserSet } = useData();

  const { setOpenInNew } = useData();
  const { openInNew } = useData();
  const [localOpenInNew, setLocalOpenInNew] = useState(openInNew);
  const switchOpenInNew = (event) => {
    setLocalOpenInNew(event.target.checked);
  };

  const { setTreeView } = useData();
  const { treeView } = useData();
  const [localTreeView, setLocalTreeView] = useState(treeView);
  const switchTreeView = (event) => {
    setLocalTreeView(event.target.checked);
  };

  const { setLastSelect } = useData();
  const { lastSelect } = useData();
  const [localLastSelect, setLocalLastSelect] = useState(lastSelect);
  const switchLastSelect = (event) => {
    setLocalLastSelect(event.target.checked);
  };

  const { setSortAZ } = useData();
  const { sortAZ } = useData();
  const [localSortAZ, setLocalSortAZ] = useState(sortAZ);
  const switchSortAZ = (event) => {
    setLocalSortAZ(event.target.checked);
  };

  const [cancelButton, setCancelButton] = useState("Отмена");
  const saveSwitchValues = () => {
    setOpenInNew(localOpenInNew);
    appSettings.UserSettings.Settings.OpenInNew = localOpenInNew;
    setTreeView(localTreeView);
    appSettings.UserSettings.Settings.TreeView = localTreeView;
    setLastSelect(localLastSelect);
    appSettings.UserSettings.Settings.LastSelect["0"] = localLastSelect;
    appSettings.UserSettings.Settings.LastSelect["1"] = selectedNodes;
    setSortAZ(localSortAZ);
    appSettings.UserSettings.Settings.SortAZ = localSortAZ;
    setCancelButton("Назад");
    SendNewSettings(currentUserSet);
  };

  const { undoPage } = useData();
  const { auth } = useData();

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
      <Box sx={{ boxShadow: 0, border: 1, height: 330, maxWidth: 510 }}>
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
                sx={{ borderRadius: 0 }}
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
                sx={{ borderRadius: 0 }}
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
