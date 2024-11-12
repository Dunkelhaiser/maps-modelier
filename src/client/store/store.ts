import { ActiveMap, Province } from "@utils/types";
import { create } from "zustand";

interface MapStore {
    activeMap: ActiveMap | null;
    setActiveMap: (map: ActiveMap) => void;
    selectedProvince: Province | null;
    setSelectedProvince: (province: Province) => void;
    deselectProvince: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
    activeMap: null,
    setActiveMap: (map: ActiveMap) => set({ activeMap: map }),
    selectedProvince: null,
    setSelectedProvince: (province: Province) => set({ selectedProvince: province }),
    deselectProvince: () => set({ selectedProvince: null }),
}));
