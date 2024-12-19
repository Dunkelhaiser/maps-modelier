import { ActiveMap } from "@utils/types";
import { StateCreator } from "zustand";
import { AppStore } from "./store";

export type Mode = "viewing" | "provinces_editing" | "states_editing" | "countries_editing";

export interface MapSlice {
    mode: Mode;
    setMode: (mode: Mode) => void;
    activeMap: ActiveMap | null;
    setActiveMap: (map: ActiveMap) => void;
    closeMap: () => void;
}

export const createMapSlice: StateCreator<AppStore, [], [], MapSlice> = (set) => ({
    mode: "viewing",
    setMode: (mode) => set({ mode }),
    activeMap: null,
    setActiveMap: (map: ActiveMap) => set({ activeMap: map }),
    closeMap: () => {
        set({
            mode: "viewing",
            activeMap: null,
            landProvinces: [],
            waterProvinces: [],
            selectedProvinces: [],
            states: [],
            selectedState: null,
        });
    },
});
