import { create } from "zustand";
import { CountriesSlice, createCountriesSlice } from "./countries";
import { createMapSlice, MapSlice } from "./map";
import { createProvincesSlice, ProvincesSlice } from "./provinces";
import { createStatesSlice, StatesSlice } from "./states";

export type AppStore = MapSlice & ProvincesSlice & StatesSlice & CountriesSlice;

export const useAppStore = create<AppStore>()((...a) => ({
    ...createMapSlice(...a),
    ...createProvincesSlice(...a),
    ...createStatesSlice(...a),
    ...createCountriesSlice(...a),
}));
