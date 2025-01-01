import { create } from "zustand";
import { createMapSlice, MapSlice } from "./map";
import { createProvincesSlice, ProvincesSlice } from "./provinces";

export type MapStore = MapSlice & ProvincesSlice;

export const useMapStore = create<MapStore>()((...a) => ({
    ...createMapSlice(...a),
    ...createProvincesSlice(...a),
}));
