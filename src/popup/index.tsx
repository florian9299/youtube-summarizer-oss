import React from "react";
import { createRoot } from "react-dom/client";
import { Popup } from "./Popup";

// Debug log before render
console.log("About to render Popup");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
} else {
  const root = createRoot(rootElement);
  root.render(<Popup />);
  console.log("Popup rendered");
}
