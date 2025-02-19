import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

import { startedApp } from "_entities/app/model";

import "_styles/main.css";

startedApp();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
