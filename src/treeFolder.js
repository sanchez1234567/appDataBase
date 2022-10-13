import React, { useState } from "react";
import { TreeView, TreeItem } from "@mui/lab";
import { Typography, Box, Grid, Link } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Item from "./item.js";
import { useData } from "./App.js";

// const data = {
//   id: "root",
//   name: "Parent",
//   children: [
//     {
//       id: "1",
//       name: "Child - 1",
//     },
//     {
//       id: "3",
//       name: "Child - 3",
//       children: [
//         {
//           id: "4",
//           name: "Child - 4",
//         },
//       ],
//     },
//   ],
// };

export default function TreeFolder() {
  const [folder, setFolder] = useState("Folder");
  const getNameFolder = (fold) => {
    setFolder(`${fold}`);
  };

  const openNewWindow = (url) => {
    window.open(`${url}`, "_blank");
  };

  const renderFolder = (folder) => {
    if (folder.includes("https")) {
      return (
        <Link
          component="button"
          variant="body1"
          onClick={() => openNewWindow(folder)}
        >
          {folder}
        </Link>
      );
    } else {
      return <Typography>{folder}</Typography>;
    }
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={String(nodes.id)}
      label={nodes.name}
      onClick={() => getNameFolder(nodes.connect)}
      sx={{ mt: 0.5 }}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const { data } = useData();

  return (
    <Box
      sx={{
        flexGrow: 1,
        mt: 1,
        ml: 1.2,
      }}
    >
      <Grid item xs={12}>
        <Item
          sx={{
            boxShadow: 0,
            border: 1,
            height: 340,
            maxWidth: 510,
            borderRadius: 0,
          }}
        >
          <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={["root"]}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{
              height: 320,
              flexGrow: 1,
              maxWidth: 490,
              overflowY: "auto",
            }}
          >
            {renderTree(data)}
          </TreeView>
        </Item>
      </Grid>
      <Grid item xs={12}>
        <Item sx={{ boxShadow: 0 }}>{renderFolder(folder)}</Item>
      </Grid>
    </Box>
  );
}
