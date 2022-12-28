import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

const widgetDivs = document.querySelectorAll(".widget-mi-base");

widgetDivs.forEach((div) => {
  const root = ReactDOM.createRoot(div);
  root.render(<App url={div.dataset.url} />);
});
