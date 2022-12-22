import React from "react";
import { IconButton } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import ComputerIcon from "@mui/icons-material/Computer";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import SortAZ from "./SortAZ.js";

export default function HandlingData(response, sortAZValue, list) {
  const lineText = response.split(/\r?\n/);

  let dataObj = {
    id: "root",
    name: "Базы данных",
    folder: "root",
    children: [],
    connect: "root",
    iconButton: null,
    icon: <FolderIcon />,
  };

  let flatArr = [];
  //let id = 1;
  let newID = -1;
  for (let index = 0; index < lineText.length; index += 1) {
    if (lineText[index].includes("[")) {
      newID = flatArr.push({
        //id: id,
        id: "",
        name: lineText[index].slice(1, lineText[index].length - 1),
        folder: "",
        children: [],
        connect: "Folder",
        iconButton: null,
        icon: <ComputerIcon />,
      });

      for (let subindex = index; subindex < lineText.length; subindex += 1) {
        if (lineText[subindex].includes("ID")) {
          flatArr[newID - 1].id = lineText[subindex].slice(3);
        }
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
        if (lineText[subindex].includes("https")) {
          flatArr[newID - 1].iconButton = (
            <IconButton
            // onClick={() =>
            //   openUrl(
            //     lineText[subindex].slice(
            //       lineText[subindex].indexOf('"') + 1,
            //       lineText[subindex].length - 2
            //     )
            //   )
            // }
            >
              <OpenInNewIcon />
            </IconButton>
          );
        }
        if (
          lineText[subindex].includes("Connect") &&
          !lineText[subindex].includes("https")
        ) {
          flatArr[newID - 1].iconButton = (
            <IconButton>
              <InstallDesktopIcon />
            </IconButton>
          );
        }
      }
      //id += 1;
    }
  }

  if (!list) {
    sortAZValue
      ? (dataObj.children = SortAZ(flatArr))
      : (dataObj.children = flatArr);

    let treeArr = [];

    for (let obj of flatArr) {
      if (obj.folder === "/") {
        treeArr.push(obj);
      } else {
        let folderArr = obj.folder.slice(1).split("/");
        let findObj = flatArr.find((item) =>
          item.name.includes(folderArr[folderArr.length - 1])
        );

        findObj.children.push(obj);
        findObj.icon = <FolderIcon />;
      }
    }

    dataObj.children = treeArr;
  }

  if (list) {
    for (let obj = 0; obj < flatArr.length; obj += 1) {
      if (flatArr[obj].connect === "Folder") {
        flatArr.splice(obj, 1);
      }
    }
    sortAZValue
      ? (dataObj.children = SortAZ(flatArr))
      : (dataObj.children = flatArr);
  }

  return dataObj;
}
