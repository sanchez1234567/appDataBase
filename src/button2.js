import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function HideTree() {
  return (
    <Box sx={{ height: 490, mt: 1, "& > :not(style)": { width: "100%" } }}>
      <Button variant="contained" size="small">
        hide tree
      </Button>
    </Box>
  );
}
