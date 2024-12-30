import { ActiveMap } from "@utils/types";
import { StateCreator } from "zustand";
import { initialCountriesSlice } from "./countries";
import { initialProvincesSlice } from "./provinces";
import { initialStatesSlice } from "./states";
import { MapStore } from "./store";

export type Mode = "viewing" | "provinces_editing" | "states_editing" | "countries_editing";

export interface MapSlice {
    mode: Mode;
    setMode: (mode: Mode) => void;
    activeMap: ActiveMap | null;
    setActiveMap: (map: ActiveMap) => void;
    closeMap: () => void;
}

const initialMapSlice = {
    mode: "viewing" as const,
    activeMap: null,
};

export const createMapSlice: StateCreator<MapStore, [], [], MapSlice> = (set) => ({
    ...initialMapSlice,
    setMode: (mode) => set({ mode }),
    setActiveMap: (map: ActiveMap) => set({ activeMap: map }),
    closeMap: () => {
        set({
            ...initialMapSlice,
            ...initialProvincesSlice,
            ...initialStatesSlice,
            ...initialCountriesSlice,
        });
    },
});
