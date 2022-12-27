import React, { useState } from "react";
import { TreeView, TreeItem } from "@mui/lab";
import { Typography, Box, Grid, Link } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Item from "./Item.js";
import { useData } from "./App.js";
import HandlingData from "./functions/HandlingData.js";
import SendNewSettings from "./functions/SendNewSettings.js";

export default function TreeFolderPage() {
  const { appSettings } = useData();
  const { settingsObj } = useData();
  const { setSettingsObj } = useData();
  const { data } = useData();
  const { switchToSetupPage } = useData();
  const { currentUserSet } = useData();
  const { backDrop } = useData();
  const { setBackDrop } = useData();
  const { expanded } = useData();
  const { setExpanded } = useData();

  const [folder, setFolder] = useState("");
  const [foldSelectedNode, setFoldSelectedNode] = useState("");
  //const [expanded, setExpanded] = useState(["root"]);
  const getNameFolder = (fold, id, child) => {
    setFolder(`${fold}`);
    if (settingsObj.lastSelect) {
      setFoldSelectedNode(String(id));
    }
    if (child.length > 0) {
      idAddRemove(id);
    }
  };

  const idAddRemove = (itemId) => {
    if (!expanded.includes(String(itemId))) {
      setExpanded((oldArr) => [...oldArr, String(itemId)]);
    } else {
      setExpanded((oldArr) => oldArr.filter((str) => str !== String(itemId)));
    }
  };

  const openSetupLink = (event, urlConnect) => {
    if (!settingsObj.lastSelect) {
      if (event.target.localName === "svg") {
        if (
          !settingsObj.openInNew &&
          event.target.dataset.testid === "OpenInNewIcon"
        ) {
          window.open(`${urlConnect}`, "_self");
        }
        if (
          settingsObj.openInNew &&
          event.target.dataset.testid === "OpenInNewIcon"
        ) {
          window.open(`${urlConnect}`, "_blank");
        }
        if (event.target.dataset.testid === "InstallDesktopIcon") {
          switchToSetupPage();
        }
      }
    }
    if (settingsObj.lastSelect) {
      if (event.target.localName === "svg") {
        if (
          !settingsObj.openInNew &&
          event.target.dataset.testid === "OpenInNewIcon"
        ) {
          setBackDrop(true);
          SendNewSettings(currentUserSet)
            .then(() => setBackDrop(false))
            .then(() => window.open(`${urlConnect}`, "_self"));
        }
        if (
          settingsObj.openInNew &&
          event.target.dataset.testid === "OpenInNewIcon"
        ) {
          window.open(`${urlConnect}`, "_blank");
        }
        if (
          !settingsObj.openInNew &&
          event.target.dataset.testid === "InstallDesktopIcon"
        ) {
          setBackDrop(true);
          SendNewSettings(currentUserSet)
            .then(() => setBackDrop(false))
            .then(() => switchToSetupPage());
        }
        if (
          settingsObj.openInNew &&
          event.target.dataset.testid === "InstallDesktopIcon"
        ) {
          switchToSetupPage();
        }
      }
    }
  };

  const handleSelect = (event, nodeIds) => {
    if (event.target.localName === "svg") {
      setSettingsObj((prevSet) => {
        return {
          ...prevSet,
          selectedNode: String(nodeIds),
        };
      });
      appSettings.UserSettings.Settings.LastSelect["1"] = nodeIds;
    }
  };

  const openLink = async (url) => {
    if (!settingsObj.lastSelect) {
      if (settingsObj.openInNew === false) {
        window.open(`${url}`, "_self");
      } else if (settingsObj.openInNew === true) {
        window.open(`${url}`, "_blank");
      }
    }
    if (settingsObj.lastSelect) {
      if (settingsObj.openInNew === false) {
        setSettingsObj((prevSet) => {
          return {
            ...prevSet,
            selectedNode: foldSelectedNode,
          };
        });
        appSettings.UserSettings.Settings.LastSelect["1"] = foldSelectedNode;
        setBackDrop(true);
        SendNewSettings(currentUserSet)
          .then(() => setBackDrop(false))
          .then(() => window.open(`${url}`, "_self"));
      }
      if (settingsObj.openInNew === true) {
        setSettingsObj((prevSet) => {
          return {
            ...prevSet,
            selectedNode: foldSelectedNode,
          };
        });
        appSettings.UserSettings.Settings.LastSelect["1"] = foldSelectedNode;
        window.open(`${url}`, "_blank");
      }
    }
  };

  const renderFolder = (f) => {
    if (f.includes("https")) {
      return (
        <Link component="button" variant="body1" onClick={() => openLink(f)}>
          {f}
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 0.5,
              pr: 0,
              cursor: "default",
            }}
          >
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
        onClick={(event) => {
          getNameFolder(nodes.connect, nodes.id, nodes.children);
          openSetupLink(event, nodes.connect);
        }}
        sx={{
          mt: 0.5,
          "&& .Mui-selected": { backgroundColor: "#6ab7ff" },
        }}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 1, ml: 1.2 }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDrop}
      >
        <CircularProgress color="primary" size="1.5rem" />
        <Typography variant="h6" sx={{ ml: 1 }}>
          сохрание настроек...
        </Typography>
      </Backdrop>
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
            selected={settingsObj.lastSelect ? settingsObj.selectedNode : null}
            onNodeSelect={settingsObj.lastSelect ? handleSelect : null}
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            expanded={expanded}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{
              height: 350,
              flexGrow: 1,
              maxWidth: 480,
              overflowY: "auto",
            }}
          >
            {renderTree(
              HandlingData(data, settingsObj.sortAZ, settingsObj.treeView)
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
