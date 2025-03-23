import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./routes/Router";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(<AppRouter />);
