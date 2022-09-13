import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useData } from "./App.js";

export default function HideTree() {
  const { flush } = useData();

  return (
    <Box sx={{ height: 494, mt: 1, "& > :not(style)": { width: "100%" } }}>
      <Button variant="contained" size="small" onClick={flush}>
        hide tree
      </Button>
    </Box>
  );
}
