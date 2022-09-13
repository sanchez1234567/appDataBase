import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import { CssBaseline, Box, Container } from "@mui/material";
import Header from "./header.js";
import TreeButtonsFolder from "./treeButtonsFolder.js";

const DataContext = React.createContext();
const useData = () => useContext(DataContext);

function App() {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const response = await fetch("http://localhost:5000");
    const result = await response.json();
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const flush = () => setData([]);

  return (
    <DataContext.Provider value={{ data, fetchData, flush }}>
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="md">
          <Box
            sx={{ bgcolor: "#CFD8DC", height: 720, width: 700, boxShadow: 2 }}
          >
            <Header />
            <TreeButtonsFolder />
          </Box>
        </Container>
      </React.Fragment>
    </DataContext.Provider>
  );
}

export { App, useData };
