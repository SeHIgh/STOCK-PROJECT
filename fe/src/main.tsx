// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
        <BrowserRouter basename={PUBLIC_URL}>
            <App />
        </BrowserRouter>
    // </StrictMode>
);
