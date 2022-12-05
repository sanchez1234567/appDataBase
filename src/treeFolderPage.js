import React, { useState } from "react";
import { TreeView, TreeItem } from "@mui/lab";
import { Typography, Box, Grid, Link } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Item from "./Item.js";
import { useData } from "./App.js";
import BuildTree from "./functions/BuildTree.js";
import BuildList from "./functions/BuildList.js";

export default function TreeFolderPage() {
  const [folder, setFolder] = useState("Folder");
  const getNameFolder = (fold) => {
    setFolder(`${fold}`);
  };

  const { data } = useData();

  const { openInNew } = useData();
  const openLink = (url) => {
    if (openInNew === false) {
      window.open(`${url}`, "_self");
    } else if (openInNew === true) {
      window.open(`${url}`, "_blank");
    }
  };

  const { treeView } = useData();

  const { sortAZ } = useData();

  const { lastSelect } = useData();
  const { selectedNodes } = useData();
  const { setSelectedNodes } = useData();
  const handleSelect = (event, nodeIds) => {
    setSelectedNodes(nodeIds);
  };
  console.log(selectedNodes);

  const { switchToSetupPage } = useData();

  const renderFolder = (folder) => {
    if (folder.includes("https")) {
      return (
        <Link
          component="button"
          variant="body1"
          onClick={() => openLink(folder)}
        >
          {folder}
        </Link>
      );
    } else {
      return <Typography>{folder}</Typography>;
    }
  };

  const renderTree = (nodes) => {
    return (
      <TreeItem
        key={nodes.id}
        nodeId={String(nodes.id)}
        label={
          <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
            <Box color="inherit" sx={{ mr: 1 }}>
              {nodes.icon}
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: "inherit", flexGrow: 1 }}
            >
              {nodes.name}
            </Typography>
            <Box color="inherit" sx={{ mr: 1 }}>
              {nodes.iconButton}
            </Box>
          </Box>
        }
        onClick={() => getNameFolder(nodes.connect)}
        sx={{ mt: 0.5, "&& .Mui-selected": { backgroundColor: "#6ab7ff" } }}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 1, ml: 1.2 }}>
      <Grid item xs={12}>
        <Item
          sx={{
            boxShadow: 0,
            border: 1,
            height: 370,
            maxWidth: 510,
            borderRadius: 0,
          }}
        >
          <TreeView
            selected={lastSelect ? selectedNodes : null}
            // onNodeSelect={handleSelect}
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={["root"]}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{
              height: 350,
              flexGrow: 1,
              maxWidth: 480,
              overflowY: "auto",
            }}
          >
            {renderTree(
              treeView
                ? BuildList(data, openLink, switchToSetupPage, sortAZ)
                : BuildTree(data, openLink, switchToSetupPage, sortAZ)
            )}
          </TreeView>
        </Item>
      </Grid>
      <Grid item xs={12}>
        <Item sx={{ boxShadow: 0 }}>{renderFolder(folder)}</Item>
      </Grid>
    </Box>
  );
}
