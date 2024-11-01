import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

interface ElectronAPI {
    saveMapImage: (imageData: string, mapId: string) => Promise<string>;
    loadMapImage: (imagePath: string) => Promise<string>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
