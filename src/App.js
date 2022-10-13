import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import { CssBaseline, Box, Dialog } from "@mui/material";
import { Typography, AppBar, Toolbar, IconButton } from "@mui/material";
import Paper, { PaperProps } from "@mui/material/Paper";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import GridViewIcon from "@mui/icons-material/GridView";
import CancelIcon from "@mui/icons-material/Cancel";
import TreeFolder from "./treeFolder.js";

const DataContext = React.createContext();
const useData = () => useContext(DataContext);

function PaperComponent(props: PaperProps) {
  return <Paper {...props} />;
}

function App() {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const response = await fetch("http://localhost:5000");
    const result = await response.text();

    const lineText = result.split(/\r?\n/);

    let dataObj = {
      id: "root",
      name: "Базы данных",
      folder: "root",
      children: [],
      connect: "root",
    };

    let flatArr = [];
    let id = 1;
    let newID = -1;
    for (let index = 0; index < lineText.length; index += 1) {
      if (lineText[index].includes("[")) {
        newID = flatArr.push({
          id: id,
          name: lineText[index].slice(1, lineText[index].length - 1),
          folder: "",
          children: [],
          connect: "Folder",
        });

        for (let subindex = index; subindex < lineText.length; subindex += 1) {
          if (lineText[subindex].includes("Folder")) {
            flatArr[newID - 1].folder = lineText[subindex].slice(7);
            break;
          }
          if (
            lineText[subindex].includes("Connect=File") ||
            lineText[subindex].includes("Connect=ws") ||
            lineText[subindex].includes("Connect=Srvr")
          ) {
            flatArr[newID - 1].connect = lineText[subindex].slice(
              lineText[subindex].indexOf('"') + 1,
              lineText[subindex].length - 2
            );
          }
        }

        id += 1;
      }
    }

    // console.log(flatArr);

    let treeArr = [];
    // console.log(flatArr);
    for (let obj of flatArr) {
      if (obj.folder === "/") {
        treeArr.push(obj);
      } else {
        let folderArr = obj.folder.slice(1).split("/");
        // console.log(folderArr);
        let findObj = flatArr.find((item) =>
          item.name.includes(folderArr[folderArr.length - 1])
        );
        // console.log(findObj);
        findObj.children.push(obj);
      }
    }

    dataObj.children = treeArr;
    // console.log(treeArr);
    setData(dataObj);
  };

  // console.log(data);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data }}>
      <React.Fragment>
        <CssBaseline />
        <Dialog open={true} PaperComponent={PaperComponent}>
          <Box
            sx={{
              height: 455,
              width: 530,
              boxShadow: 1,
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position="static">
                <Toolbar>
                  <GridViewIcon />
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, ml: 1.5 }}
                  >
                    Запуск облачных баз
                  </Typography>
                  <IconButton component="label">
                    <InstallDesktopIcon />
                  </IconButton>
                  <IconButton component="label">
                    <SettingsIcon />
                  </IconButton>
                  <IconButton component="label">
                    <HelpIcon />
                  </IconButton>
                  <IconButton component="label">
                    <CancelIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
            </Box>
            <TreeFolder />
          </Box>
        </Dialog>
      </React.Fragment>
    </DataContext.Provider>
  );
}

export { App, useData };
