import React, { useState } from "react";
import { TreeView, TreeItem } from "@mui/lab";
import { Typography, Box, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Item from "./item.js";
import ShowTree from "./button1.js";
import HideTree from "./button2.js";
import TempButton from "./button3.js";
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

export default function TreeButtonsFolder() {
  const [folder, setFolder] = useState("Folder");
  const getNameFolder = (fold) => {
    setFolder(`${fold}`);
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      onClick={() => getNameFolder(nodes.id)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const { data } = useData();

  return (
    <Box sx={{ flexGrow: 1, mt: 0.5 }}>
      <Grid container spacing={1}>
        <Grid item xs={9}>
          <Item>
            <TreeView
              aria-label="rich object"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpanded={["root"]}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{
                height: 610,
                flexGrow: 1,
                maxWidth: 400,
                overflowY: "auto",
              }}
            >
              {renderTree(data)}
            </TreeView>
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
            <Typography variant="h7">{folder}</Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
