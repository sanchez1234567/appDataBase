import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function ShowTree() {
  return (
    <Box sx={{ height: 40, mt: 1, "& > :not(style)": { width: "100%" } }}>
      <Button variant="contained" size="small">
        show tree
      </Button>
    </Box>
  );
}
