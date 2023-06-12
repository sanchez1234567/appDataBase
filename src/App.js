import React, { useState, useContext, useEffect } from "react";
import { CssBaseline, Box, Dialog, Snackbar } from "@mui/material";
import { IconButton } from "@mui/material";
import { CircularProgress } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import TreeFolderPage from "./TreeFolderPage.js";
import AuthPage from "./AuthPage.js";
import LocalSetupPage from "./LocalSetupPage.js";
import SettingsPage from "./SettingsPage.js";
import SupportPage from "./SupportPage.js";
import RepeatSendNewSettings from "./functions/RepeatSendNewSettings.js";
import SendNewSettings from "./functions/SendNewSettings.js";
import PaperComponent from "./components/PaperComponent.js";
import CustomAppBar from "./components/CustomAppBar.js";

const DataContext = React.createContext();
const useData = () => useContext(DataContext);

function App(customUrl) {
  const [appSettings, setAppSettings] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingButtonIndicator, setLoadingButtonIndicator] = useState(
    <CircularProgress color="inherit" size={16} />
  );
  const [wait, setWait] = useState(true);
  const [auth, setAuth] = useState(false);
  const [isOnline, setIsOnline] = useState("");
  const [isOnlineIcon, setIsOnlineIcon] = useState([]);
  const [backDrop, setBackDrop] = useState(false);
  const [expanded, setExpanded] = useState(["root"]);
  const [openSnackB, setOpenSnackB] = useState(false);
  const [snackBMes, setSnackBMes] = useState("");

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

  const [settingsObj, setSettingsObj] = useState({
    openInNew: false,
    treeView: false,
    lastSelect: false,
    selectedNode: "",
    sortAZ: false,
  });

  let currentUser = {
    name: userName,
    password: userPassword,
  };

  let currentUserSet = {
    name: userName,
    password: userPassword,
    settings: appSettings,
  };

  const getAppSettings = async (url) => {
    const responseAppSet = await fetch(url);
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
        setSnackBMes("Сервер MiBase не отвечает. Свяжитесь с поддержкой.");
        setLoadingButtonIndicator(<ErrorIcon />);
        setOpenSnackB(true);
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
      setSnackBMes("Файл настроек MiBase не найден. Свяжитесь с поддержкой.");
      setLoadingButtonIndicator(<ErrorIcon />);
      setOpenSnackB(true);
    }
  };

  useEffect(() => {
    getAppSettings(customUrl.url).catch((err) => handleErrSettings(err));
  }, [customUrl]);

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
        setSnackBMes("Сервер MiBase не отвечает. Свяжитесь с поддержкой.");
        setLoadingButtonIndicator(<ErrorIcon />);
        setOpenSnackB(true);
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
      setSnackBMes("Список баз MiBase не найден. Свяжитесь с поддержкой.");
      setOpenSnackB(true);
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
    setUserName("");
    setUserPassword("");
    setVisibleAuth(false);
    setVisibleLocalSetup(false);
    setVisibleSettings(false);
    setVisibleSupport(false);
    setVisibleTreeFolder(false);
    setVisibleAppBar(false);
    setOpenDialog(false);
  };

  const undoPage = () => {
    if (!settingsObj.lastSelect) {
      if (visibleTreeFolder === false) {
        switchToTreeFolder();
      } else {
        closeApp();
      }
    }
    if (settingsObj.lastSelect) {
      if (settingsObj.openInNew)
        if (visibleTreeFolder === false) {
          switchToTreeFolder();
        } else {
          setBackDrop(true);
          SendNewSettings(currentUserSet)
            .then(() => setBackDrop(false))
            .then(() => closeApp());
        }
      if (!settingsObj.openInNew) {
        if (visibleTreeFolder === false) {
          switchToTreeFolder();
        } else {
          closeApp();
        }
      }
    }
  };

  const handleCloseSnackB = () => {
    setOpenSnackB(false);
  };

  return (
    <DataContext.Provider
      value={{
        header,
        auth,
        settingsObj,
        setSettingsObj,
        data,
        setData,
        currentUser,
        currentUserSet,
        userName,
        userPassword,
        setUserName,
        setUserPassword,
        appSettings,
        setAppSettings,
        undoPage,
        switchToSetupPage,
        switchToSettingsPage,
        switchToSupportPage,
        switchToTreeFolder,
        visibleTreeFolder,
        setVisibleAuth,
        setOpenDialog,
        setHeader,
        isOnline,
        setIsOnline,
        isOnlineIcon,
        setIsOnlineIcon,
        backDrop,
        setBackDrop,
        expanded,
        setExpanded,
        setOpenSnackB,
        setSnackBMes,
      }}
    >
      <React.Fragment>
        <CssBaseline />
        <Box>
          <Snackbar
            open={openSnackB}
            onClose={handleCloseSnackB}
            message={snackBMes}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackB}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          ></Snackbar>
          <LoadingButton
            variant="contained"
            onClick={() => handleOpenDialog()}
            loading={loadingStatus}
            loadingIndicator={loadingButtonIndicator}
            disabled={wait}
            sx={{ borderRadius: 1 }}
          >
            MiBase
          </LoadingButton>
        </Box>
        <Dialog
          open={openDialog}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <Box
            height={visibleAuth ? 300 : 500}
            width={530}
            sx={{ boxShadow: 1 }}
          >
            <Box
              style={{ cursor: "default" }}
              id="draggable-dialog-title"
              sx={{ flexGrow: 1 }}
            >
              {visibleAppBar ? <CustomAppBar /> : null}
            </Box>
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
