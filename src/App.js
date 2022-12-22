import React, { useState, useContext, useEffect } from "react";
import { CssBaseline, Box, Dialog, Alert } from "@mui/material";
import { Typography, AppBar, Toolbar, IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Paper, { PaperProps } from "@mui/material/Paper";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import LanguageIcon from "@mui/icons-material/Language";
import ComputerIcon from "@mui/icons-material/Computer";
import CancelIcon from "@mui/icons-material/Cancel";
import UndoIcon from "@mui/icons-material/Undo";
import TreeFolderPage from "./TreeFolderPage.js";
import AuthPage from "./AuthPage.js";
import LocalSetupPage from "./LocalSetupPage.js";
import SettingsPage from "./SettingsPage.js";
import SupportPage from "./SupportPage.js";
import RepeatSendNewSettings from "./functions/RepeatSendNewSettings.js";
import SendNewSettings from "./functions/SendNewSettings.js";

const DataContext = React.createContext();
const useData = () => useContext(DataContext);

function PaperComponent(props: PaperProps) {
  return <Paper {...props} />;
}

function App() {
  const [appSettings, setAppSettings] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [wait, setWait] = useState(true);
  const [auth, setAuth] = useState(false);
  const [isOnline, setIsOnline] = useState("");
  const [isOnlineIcon, setIsOnlineIcon] = useState([]);

  const [data, setData] = useState([]);
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [header, setHeader] = useState("");
  const [visibleAuth, setVisibleAuth] = useState(false);
  const [visibleTreeFolder, setVisibleTreeFolder] = useState(false);
  const [visibleLocalSetup, setVisibleLocalSetup] = useState(false);
  const [visibleSettings, setVisibleSettings] = useState(false);
  const [visibleSupport, setVisibleSupport] = useState(false);
  const [visibleAppBar, setVisibleAppBar] = useState(false);

  const [openInNew, setOpenInNew] = useState(false);
  const [treeView, setTreeView] = useState(true);
  const [lastSelect, setLastSelect] = useState(false);
  const [selectedNode, setSelectedNode] = useState("");
  const [sortAZ, setSortAZ] = useState(false);

  let currentUser = {
    name: userName,
    password: userPassword,
  };

  let currentUserSet = {
    name: userName,
    password: userPassword,
    settings: appSettings,
  };

  const getAppSettings = async () => {
    const responseAppSet = await fetch("http://localhost:5000/defaultSettings");
    if (responseAppSet.ok) {
      const resultAppSet = await responseAppSet.json();
      setAppSettings(resultAppSet);
      setAuth(resultAppSet.AppSettings.auth);
      localStorage.setItem("defaultAppSettings", JSON.stringify(resultAppSet));
      setLoadingStatus(false);
      setWait(false);
    }
    if (!responseAppSet.ok && responseAppSet.status === 404) {
      throw new Error("404");
    }
  };

  const handleErrSettings = (fetchErr) => {
    if (String(fetchErr).includes("Failed to fetch")) {
      if (localStorage.getItem("defaultAppSettings") === null) {
        setServerErr(true);
      }
      if (localStorage.getItem("defaultAppSettings") !== null) {
        const localSettings = JSON.parse(
          localStorage.getItem("defaultAppSettings")
        );
        setAppSettings(localSettings);
        setAuth(localSettings.AppSettings.auth);
        setLoadingStatus(false);
        setWait(false);
      }
    }
    if (String(fetchErr).includes("404")) {
      setSettingsErr(true);
    }
  };

  useEffect(() => {
    getAppSettings().catch((err) => handleErrSettings(err));
  }, []);

  const getData = async () => {
    try {
      const responseData = await fetch(appSettings.AppSettings.v8i);
      if (responseData.ok) {
        const resultData = await responseData.text();
        setData(resultData);
        localStorage.setItem("defaultData", resultData);
        setIsOnline(true);
        setIsOnline("онлайн");
        setOpenDialog(true);
        switchToTreeFolder();
      }
      if (!responseData.ok && responseData.status === 404) {
        throw new Error("404");
      }
    } catch (err) {
      handleErrData(err);
    }
  };

  const handleErrData = async (fetchDataErr) => {
    if (String(fetchDataErr).includes("Failed to fetch")) {
      if (localStorage.getItem("defaultData") === null) {
        setServerErr(true);
      }
      if (localStorage.getItem("defaultData") !== null && !auth) {
        setData(localStorage.getItem("defaultData"));
        setIsOnline(false);
        setIsOnline("оффлайн");
        setOpenDialog(true);
        switchToTreeFolder();
      }
    }
    if (String(fetchDataErr).includes("404")) {
      setDataErr(true);
    }
  };

  const handleOpenDialog = () => {
    if (!auth) {
      getData();
    }
    if (auth) {
      RepeatSendNewSettings();
      setOpenDialog(true);
      setVisibleAuth(true);
    }
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

  const switchToTreeFolder = async () => {
    setHeader("Список баз");
    setVisibleAuth(false);
    setVisibleLocalSetup(false);
    setVisibleSettings(false);
    setVisibleSupport(false);
    setVisibleTreeFolder(true);
    setVisibleAppBar(true);
  };

  const closeApp = () => {
    setVisibleAuth(false);
    setVisibleLocalSetup(false);
    setVisibleSettings(false);
    setVisibleSupport(false);
    setVisibleTreeFolder(false);
    setVisibleAppBar(false);
    setOpenDialog(false);
  };

  const undoPage = () => {
    if (!lastSelect) {
      if (visibleTreeFolder === false) {
        switchToTreeFolder();
      } else {
        closeApp();
      }
    }
    if (lastSelect) {
      if (openInNew)
        if (visibleTreeFolder === false) {
          switchToTreeFolder();
        } else {
          SendNewSettings(currentUserSet).then(closeApp);
        }
      if (!openInNew) {
        if (visibleTreeFolder === false) {
          switchToTreeFolder();
        } else {
          closeApp();
        }
      }
    }
  };

  const [serverErr, setServerErr] = useState(false);
  const [settingsErr, setSettingsErr] = useState(false);
  const [dataErr, setDataErr] = useState(false);

  const renderButton = () => {
    if (serverErr) {
      return (
        <Alert severity="error">
          Сервер не отвечает. Свяжитесь с поддержкой
        </Alert>
      );
    }
    if (settingsErr) {
      return (
        <Alert severity="error">
          Файл настроек не найден. Свяжитесь с поддержкой
        </Alert>
      );
    }
    if (dataErr) {
      return (
        <Alert severity="error">
          Список баз не найден. Свяжитесь с поддержкой
        </Alert>
      );
    } else {
      return (
        <LoadingButton
          variant="contained"
          onClick={() => handleOpenDialog()}
          loading={loadingStatus}
          disabled={wait}
        >
          Открыть
        </LoadingButton>
      );
    }
  };

  let appBar = (
    <AppBar position="static">
      <Toolbar>
        <Tooltip title={isOnline} placement="top">
          {isOnlineIcon ? <LanguageIcon /> : <ComputerIcon />}
        </Tooltip>
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
        currentUser,
        currentUserSet,
        userName,
        userPassword,
        setUserName,
        setUserPassword,
        auth,
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
        selectedNode,
        setSelectedNode,
        sortAZ,
        setSortAZ,
        setVisibleAuth,
        setOpenDialog,
        setServerErr,
        setSettingsErr,
        setDataErr,
        setHeader,
        setIsOnline,
        setIsOnlineIcon,
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
          {renderButton()}
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
