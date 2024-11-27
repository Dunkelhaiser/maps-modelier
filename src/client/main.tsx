import { Polygon } from "pixi.js";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import type { Map, Province, State } from "@utils/types.ts";
import "./index.css";

interface ProvinceType {
    id: number;
    color: string;
    type: string;
}

interface ElectronAPI {
    saveMapImage: (imageData: string, mapId: string) => Promise<string>;
    loadMapImage: (imagePath: string) => Promise<string>;
    getMaps: () => Promise<Map[]>;
    createMap: (name: string, imageData: string) => Promise<Map | null>;
    updateMapName: (id: string, name: string) => Promise<Map | null>;
    getAllProvinces: (mapId: string, type: "land" | "water") => Promise<Province[]>;
    getProvinceByColor: (mapId: string, color: string) => Promise<Province | null>;
    getProvinceById: (mapId: string, id: number) => Promise<Province | null>;
    extractProvinceShapes: (
        imagePath: string,
        provinces: ProvinceType[]
    ) => Promise<Record<string, Polygon | Polygon[]>>;
    changeProvinceType: (mapId: string, id: number[], type: "land" | "water") => Promise<Province | null>;
    getStateByProvinceId: (mapId: string, provinceId: number) => Promise<State | null>;
    getAllStates: (mapId: string) => Promise<State[]>;
    createState: (mapId: string, name: string, provinces?: number[]) => Promise<State>;
    addProvinces: (mapId: string, stateId: number, provinceIds: number[]) => Promise<void>;
    removeProvinces: (mapId: string, provinceIds: number[]) => Promise<void>;
    renameState: (mapId: string, stateId: number, name: string) => Promise<Omit<State, "provinces">>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

createRoot(document.getElementById("root")!).render(<App />);
