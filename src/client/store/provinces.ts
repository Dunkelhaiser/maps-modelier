import { Province } from "@utils/types";
import { StateCreator } from "zustand";
import { MapStore } from "./store";

export interface ProvincesSlice {
    selectedProvinces: Province[];
    deselectProvinces: () => void;
}

export const initialProvincesSlice = {
    selectedProvinces: [],
};

export const createProvincesSlice: StateCreator<MapStore, [], [], ProvincesSlice> = (set) => ({
    ...initialProvincesSlice,
    deselectProvinces: () => set({ selectedProvinces: [], selectedState: null }),
});
