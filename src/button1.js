import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useData } from "./App.js";

export default function ShowTree() {
  const { fetchData } = useData();

  return (
    <Box sx={{ height: 40, mt: 1, "& > :not(style)": { width: "100%" } }}>
      <Button variant="contained" size="small" onClick={fetchData}>
        show tree
      </Button>
    </Box>
  );
}
