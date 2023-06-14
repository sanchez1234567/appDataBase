import { useData } from "../App.js";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Tooltip, IconButton } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import ComputerIcon from "@mui/icons-material/Computer";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import CancelIcon from "@mui/icons-material/Cancel";
import UndoIcon from "@mui/icons-material/Undo";

export default function CustomAppBar() {
  const { header } = useData();
  const { isOnline } = useData();
  const { isOnlineIcon } = useData();
  const { switchToSetupPage } = useData();
  const { switchToSettingsPage } = useData();
  const { switchToSupportPage } = useData();
  const { undoPage } = useData();
  const { cVisible } = useData();

  return (
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
          {cVisible.cTreeFolder ? <CancelIcon /> : <UndoIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
