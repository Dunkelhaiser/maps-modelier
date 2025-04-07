import { StateCreator } from "zustand";
import { initialSelectionsSlice } from "./selections";
import { useSidebarStore } from "./sidebar";
import { MapStore } from "./store";

export type Mode = "viewing" | "editing";
export type DisplayMode = "countries" | "ethnicities" | "population";

export interface MapSlice {
    mode: Mode;
    setMode: (mode: Mode) => void;
    displayMode: DisplayMode;
    setDisplayMode: (displayMode: DisplayMode) => void;
    activeMap: string | null;
    setActiveMap: (map: string) => void;
    closeMap: () => void;
}

const initialMapSlice = {
    mode: "viewing" as const,
    displayMode: "countries" as const,
    activeMap: null,
};

export const createMapSlice: StateCreator<MapStore, [], [], MapSlice> = (set) => ({
    ...initialMapSlice,
    setMode: (mode) => set({ mode }),
    setDisplayMode: (displayMode) => set({ displayMode }),
    setActiveMap: (map) => set({ activeMap: map }),
    closeMap: () => {
        set({
            ...initialMapSlice,
            ...initialSelectionsSlice,
        });

        useSidebarStore.getState().closeSidebar();
    },
});
