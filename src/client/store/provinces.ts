import { Province } from "@utils/types";
import { StateCreator } from "zustand";
import { AppStore } from "./store";

export interface ProvincesSlice {
    selectedProvinces: Province[];
    deselectProvinces: () => void;
}

export const initialProvincesSlice = {
    selectedProvinces: [],
};

export const createProvincesSlice: StateCreator<AppStore, [], [], ProvincesSlice> = (set) => ({
    ...initialProvincesSlice,
    deselectProvinces: () => set({ selectedProvinces: [], selectedState: null }),
});
