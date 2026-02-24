import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { applyTheme, getTheme } from "./lib/theme";

const el = document.getElementById("root");
if (!el) throw new Error("#root not found");

// Default to LIGHT unless user explicitly chose dark.
applyTheme(getTheme());

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>
);
