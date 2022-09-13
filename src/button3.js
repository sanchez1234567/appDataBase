import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function TempButton() {
  return (
    <Box sx={{ height: 60, "& > :not(style)": { width: "100%" } }}>
      <Button variant="contained" size="small">
        temp
      </Button>
    </Box>
  );
}
