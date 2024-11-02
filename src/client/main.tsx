import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import type { Map } from "@utils/types.ts";
import "./index.css";

interface ElectronAPI {
    saveMapImage: (imageData: string, mapId: string) => Promise<string>;
    loadMapImage: (imagePath: string) => Promise<string>;
    getMaps: () => Promise<Map[]>;
    createMap: (name: string) => Promise<Map | null>;
    updateMapName: (id: string, name: string) => Promise<Map | null>;
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
