import { create } from "zustand";
import { createMapSlice, MapSlice } from "./map";
import { createSelectionsSlice, SelectionsSlice } from "./selections";

export type MapStore = MapSlice & SelectionsSlice;

export const useMapStore = create<MapStore>()((...a) => ({
    ...createMapSlice(...a),
    ...createSelectionsSlice(...a),
}));
