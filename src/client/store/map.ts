import { MapType } from "src/shared/types";
import { StateCreator } from "zustand";
import { initialProvincesSlice } from "./provinces";
import { MapStore } from "./store";

export type Mode = "viewing" | "editing";

export interface MapSlice {
    mode: Mode;
    setMode: (mode: Mode) => void;
    activeMap: MapType | null;
    setActiveMap: (map: MapType) => void;
    closeMap: () => void;
}

const initialMapSlice = {
    mode: "viewing" as const,
    activeMap: null,
};

export const createMapSlice: StateCreator<MapStore, [], [], MapSlice> = (set) => ({
    ...initialMapSlice,
    setMode: (mode) => set({ mode }),
    setActiveMap: (map: MapType) => set({ activeMap: map }),
    closeMap: () => {
        set({
            ...initialMapSlice,
            ...initialProvincesSlice,
        });
    },
});
