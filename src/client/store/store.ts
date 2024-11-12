import { ActiveMap } from "@utils/types";
import { create } from "zustand";

interface MapStore {
    activeMap: ActiveMap | null;
    setActiveMap: (map: ActiveMap) => void;
    selectedProvince: number | null;
    setSelectedProvince: (id: number) => void;
    deselectProvince: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
    activeMap: null,
    setActiveMap: (map: ActiveMap) => set({ activeMap: map }),
    selectedProvince: null,
    setSelectedProvince: (id: number) => set({ selectedProvince: id }),
    deselectProvince: () => set({ selectedProvince: null }),
}));
