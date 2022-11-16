import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Switch, Grid } from "@mui/material";
import Item from "./item.js";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DoneIcon from "@mui/icons-material/Done";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import { useData } from "./App.js";

export default function SettingsPage() {
  //const { appSettings } = useData();

  const { setOpenInNew } = useData();
  const { openInNew } = useData();
  const switchOpenInNew = (event) => {
    setOpenInNew(event.target.checked);
  };

  const { setTreeView } = useData();
  const { treeView } = useData();
  const switchTreeView = (event) => {
    setTreeView(event.target.checked);
  };

  const { setLastSelect } = useData();
  const { lastSelect } = useData();
  const switchLastSelect = (event) => {
    setLastSelect(event.target.checked);
  };

  const { setSortAZ } = useData();
  const { sortAZ } = useData();
  const switchSortAZ = (event) => {
    setSortAZ(event.target.checked);
  };

  const { undoPage } = useData();

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
          openInNew,
          switchOpenInNew
        )}
        {renderLine(
          <FormatListBulletedIcon />,
          "Отображать в виде списка",
          0,
          treeView,
          switchTreeView
        )}
        {renderLine(
          <DoneIcon />,
          "Запомнить последний выбор",
          0,
          lastSelect,
          switchLastSelect
        )}
        {renderLine(
          <SortByAlphaIcon />,
          "Сортировка по имени",
          0,
          sortAZ,
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
                Отменить
              </Button>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
