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
    const result = await response.text();

    const lineText = result.split(/\r?\n/);

    let dataObj = {
      id: "root",
      name: "DataBase",
      folder: "root",
      children: [],
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
            lineText[subindex].includes("Connect=ws")
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
