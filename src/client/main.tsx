import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { errorToast } from "@utils/errorToast.ts";
import { Polygon } from "pixi.js";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import type { Country, CountryProperties, Map, Province, State } from "@utils/types.ts";
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
    deleteMap: (id: string) => Promise<void>;
    renameMap: (id: string, name: string) => Promise<Map | null>;
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
    removeProvinces: (mapId: string, stateId: number, provinceIds: number[]) => Promise<void>;
    renameState: (mapId: string, stateId: number, name: string) => Promise<Omit<State, "provinces">>;
    deleteState: (mapId: string, stateId: number) => Promise<void>;
    createCountry: (mapId: string, name: string, tag: string, color?: string) => Promise<Omit<Country, "states">>;
    getAllCountries: (mapId: string) => Promise<Country[]>;
    addStates: (mapId: string, countryTag: string, states: number[]) => Promise<void>;
    removeStates: (mapId: string, countryTag: string, states: number[]) => Promise<void>;
    updateCountry: (mapId: string, countryTag: string, options: CountryProperties) => Promise<Omit<Country, "states">>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            onError: errorToast,
        },
        queries: {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
);
