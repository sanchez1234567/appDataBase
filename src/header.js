import * as React from "react";
import { Typography, Box, Grid } from "@mui/material";
import Item from "./item.js";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1, mt: 0.5 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h7">Header</Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
