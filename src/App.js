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
  const fetchSettings = async () => {
    const responseSettings = await fetch("http://localhost:5000/settings");
    const resultSettings = await responseSettings.json();
    setAppSettings(resultSettings);
  };

  useEffect(() => {
    fetchSettings().then(() => setWait(false));
  }, []);

  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [header, setHeader] = useState("Запуск баз");
  const [visibleAuth, setVisibleAuth] = useState(true);
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setOpenInNew(appSettings.UserSettings.Settings.OpenInNew);
    setTreeView(appSettings.UserSettings.Settings.TreeView);
    setLastSelect(appSettings.UserSettings.Settings.LastSelect[0]);
    setSelectedNodes(appSettings.UserSettings.Settings.LastSelect[1]);
    setSortAZ(appSettings.UserSettings.Settings.SortAZ);
  };

  const localSetupHeader = () => {
    setHeader(appSettings.UserSettings.Setup.Header);
    setVisibleAuth(false);
    setVisibleLocalSetup(true);
    setVisibleSettings(false);
    setVisibleSupport(false);
    setVisibleTreeFolder(false);
  };
  const settingsHeader = () => {
    setHeader(appSettings.UserSettings.Settings.Header);
    setVisibleAuth(false);
    setVisibleLocalSetup(false);
    setVisibleSettings(true);
    setVisibleSupport(false);
    setVisibleTreeFolder(false);
  };
  const supportHeader = () => {
    setHeader(appSettings.UserSettings.Help.Header);
    setVisibleAuth(false);
    setVisibleLocalSetup(false);
    setVisibleSettings(false);
    setVisibleSupport(true);
    setVisibleTreeFolder(false);
  };

  const undoPage = () => {
    if (visibleTreeFolder === false) {
      setVisibleAuth(false);
      setVisibleLocalSetup(false);
      setVisibleSettings(false);
      setVisibleSupport(false);
      setVisibleTreeFolder(true);
      setHeader("Запуск баз");
    } else {
      setVisibleAuth(true);
      setVisibleLocalSetup(false);
      setVisibleSettings(false);
      setVisibleSupport(false);
      setVisibleTreeFolder(false);
      setVisibleAppBar(false);
      setOpenDialog(false);
      setHeader("Запуск баз");
    }
  };

  let appBar = (
    <AppBar position="static">
      <Toolbar>
        <GridViewIcon />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1.5 }}>
          {header}
        </Typography>
        <IconButton component="label" onClick={localSetupHeader}>
          <InstallDesktopIcon />
        </IconButton>
        <IconButton component="label" onClick={settingsHeader}>
          <SettingsIcon />
        </IconButton>
        <IconButton component="label" onClick={supportHeader}>
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
        setVisibleTreeFolder,
        setVisibleAuth,
        setVisibleAppBar,
        appSettings,
        setData,
        undoPage,
        openInNew,
        setOpenInNew,
        localSetupHeader,
        treeView,
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
            onClick={() => {
              handleOpenDialog();
            }}
            disabled={wait}
          >
            Нажми
          </Button>
        </Box>
        <Dialog open={openDialog} PaperComponent={PaperComponent}>
          <Box sx={{ height: 500, width: 530, boxShadow: 1 }}>
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
