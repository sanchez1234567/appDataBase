import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AppSnackbar(props) {
  return (
    <Snackbar
      open={props.openAS}
      onClose={props.closeAS}
      message={props.mesAS}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={props.clickAS}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    ></Snackbar>
  );
}
