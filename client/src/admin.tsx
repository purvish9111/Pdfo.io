import React from "react";
import { createRoot } from "react-dom/client";
import AdminApp from "./AdminApp";
import "./index.css";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<AdminApp />);
} else {
  console.error("Could not find root element");
}