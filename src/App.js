import "./App.css";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Header from "./header.js";
import MakeTree from "./tree.js";
import ShowTree from "./button1.js";
import HideTree from "./button2.js";
import TempButton from "./button3.js";
import FolderInfo from "./folderInfo.js";

function App() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlighn: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ bgcolor: "#CFD8DC", height: 720, width: 700, boxShadow: 2 }}>
          <Box sx={{ flexGrow: 1, mt: 0.5 }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Item>
                  <Header />
                </Item>
              </Grid>
              <Grid item xs={9}>
                <Item>
                  <MakeTree />
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item>
                  <ShowTree />
                  <HideTree />
                  <TempButton />
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                  <FolderInfo />
                </Item>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
