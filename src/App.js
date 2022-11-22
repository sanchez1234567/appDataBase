import "./App.css";
import React, { useState, useContext, useEffect } from "react";
import { CssBaseline, Box, Dialog, Button } from "@mui/material";
import { Typography, AppBar, Toolbar, IconButton } from "@mui/material";
import Paper, { PaperProps } from "@mui/material/Paper";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import GridViewIcon from "@mui/icons-material/GridView";
import CancelIcon from "@mui/icons-material/Cancel";
import UndoIcon from "@mui/icons-material/Undo";
import TreeFolderPage from "./treeFolderPage.js";
import AuthPage from "./authPage.js";
import LocalSetupPage from "./localSetupPage.js";
import SettingsPage from "./settingsPage.js";
import SupportPage from "./supportPage.js";

const DataContext = React.createContext();
const useData = () => useContext(DataContext);

function PaperComponent(props: PaperProps) {
  return <Paper {...props} />;
}

function App() {
  const [appSettings, setAppSettings] = useState([]);
  const [wait, setWait] = useState(true);
  const [authValue, setAuthValue] = useState();
  const [settingsErr, setSettingsErr] = useState();
  const [dataErr, setDataErr] = useState();

  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [header, setHeader] = useState("Список баз");

  const [visibleAuth, setVisibleAuth] = useState();
  const [visibleTreeFolder, setVisibleTreeFolder] = useState(false);
  const [visibleLocalSetup, setVisibleLocalSetup] = useState(false);
  const [visibleSettings, setVisibleSettings] = useState(false);
  const [visibleSupport, setVisibleSupport] = useState(false);
  const [visibleAppBar, setVisibleAppBar] = useState(false);

  const [openInNew, setOpenInNew] = useState();
  const [treeView, setTreeView] = useState();
  const [lastSelect, setLastSelect] = useState();
  const [selectedNodes, setSelectedNodes] = useState();
  const [sortAZ, setSortAZ] = useState();

  const getAppSettings = async () => {
    const responseSettings = await fetch(
      "http://localhost:5000/defaultSettings"
    );
    if (responseSettings.ok) {
      const resultSettings = await responseSettings.json();
      setAppSettings(resultSettings);
      setAuthValue(resultSettings.AppSettings.auth);
      setVisibleAuth(resultSettings.AppSettings.auth);
    }
    if (!responseSettings.ok) {
      throw new Error("Failed to fetch");
    }
  };

  const getData = async () => {
    try {
      const responseData = await fetch(appSettings.AppSettings.v8i);
      if (responseData.ok) {
        const resultData = await responseData.text();
        setData(resultData);
      }
      if (!responseData.ok || responseData.status === 404) {
        throw new Error("Failed to fetch");
      }
    } catch (err) {
      setDataErr(`${err}`);
    }
  };

  useEffect(() => {
    getAppSettings()
      .then(() => setWait(false))
      .catch((err) => setSettingsErr(`${err}`));
  }, []);

  const handleOpenDialog = async () => {
    if (!authValue) {
      await getData();
      await switchToTreeFolder();
    }
    setOpenDialog(true);
    setOpenInNew(appSettings.UserSettings.Settings.OpenInNew);
    setTreeView(appSettings.UserSettings.Settings.TreeView);
    setLastSelect(appSettings.UserSettings.Settings.LastSelect[0]);
    setSelectedNodes(appSettings.UserSettings.Settings.LastSelect[1]);
    setSortAZ(appSettings.UserSettings.Settings.SortAZ);
  };

  const switchToSetupPage = () => {
    setHeader(appSettings.UserSettings.Setup.Header);
    setVisibleAuth(false);
    setVisibleLocalSetup(true);
    setVisibleSettings(false);
    setVisibleSupport(false);
    setVisibleTreeFolder(false);
    setVisibleAppBar(true);
  };
  const switchToSettingsPage = () => {
    setHeader(appSettings.UserSettings.Settings.Header);
    setVisibleAuth(false);
    setVisibleLocalSetup(false);
    setVisibleSettings(true);
    setVisibleSupport(false);
    setVisibleTreeFolder(false);
    setVisibleAppBar(true);
  };
  const switchToSupportPage = () => {
    setHeader(appSettings.UserSettings.Help.Header);
    setVisibleAuth(false);
    setVisibleLocalSetup(false);
    setVisibleSettings(false);
    setVisibleSupport(true);
    setVisibleTreeFolder(false);
    setVisibleAppBar(true);
  };

  const switchToTreeFolder = () => {
    setHeader("Список баз");
    setVisibleAuth(false);
    setVisibleLocalSetup(false);
    setVisibleSettings(false);
    setVisibleSupport(false);
    setVisibleTreeFolder(true);
    setVisibleAppBar(true);
  };

  const undoPage = () => {
    if (visibleTreeFolder === false) {
      switchToTreeFolder();
    } else {
      setVisibleAuth(false);
      setVisibleLocalSetup(false);
      setVisibleSettings(false);
      setVisibleSupport(false);
      setVisibleTreeFolder(false);
      setVisibleAppBar(false);
      setOpenDialog(false);
    }
  };

  let appBar = (
    <AppBar position="static">
      <Toolbar>
        <GridViewIcon />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1.5 }}>
          {header}
        </Typography>
        <IconButton component="label" onClick={switchToSetupPage}>
          <InstallDesktopIcon />
        </IconButton>
        <IconButton component="label" onClick={switchToSettingsPage}>
          <SettingsIcon />
        </IconButton>
        <IconButton component="label" onClick={switchToSupportPage}>
          <HelpIcon />
        </IconButton>
        <IconButton component="label" onClick={undoPage}>
          {visibleTreeFolder ? <CancelIcon /> : <UndoIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  return (
    <DataContext.Provider
      value={{
        data,
        authValue,
        appSettings,
        setData,
        undoPage,
        openInNew,
        setOpenInNew,
        switchToSetupPage,
        switchToTreeFolder,
        treeView,
        setAppSettings,
        setTreeView,
        lastSelect,
        setLastSelect,
        selectedNodes,
        setSelectedNodes,
        sortAZ,
        setSortAZ,
      }}
    >
      <React.Fragment>
        <CssBaseline />
        <Box
          sx={{
            height: 500,
            width: 550,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mx: "auto",
          }}
        >
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            disabled={wait}
          >
            {String(settingsErr).includes("Failed to fetch")
              ? "Ошибка"
              : "Открыть"}
          </Button>
        </Box>
        <Dialog open={openDialog} PaperComponent={PaperComponent}>
          <Box
            height={visibleAuth ? 300 : 500}
            width={530}
            sx={{ boxShadow: 1 }}
          >
            <Box sx={{ flexGrow: 1 }}>{visibleAppBar ? appBar : null}</Box>
            {visibleAuth ? <AuthPage /> : null}
            {visibleTreeFolder ? <TreeFolderPage /> : null}
            {visibleLocalSetup ? <LocalSetupPage /> : null}
            {visibleSettings ? <SettingsPage /> : null}
            {visibleSupport ? <SupportPage /> : null}
          </Box>
        </Dialog>
      </React.Fragment>
    </DataContext.Provider>
  );
}

export { App, useData };
