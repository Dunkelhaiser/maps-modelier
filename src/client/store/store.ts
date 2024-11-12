import { ActiveMap, Province } from "@utils/types";
import { create } from "zustand";

interface MapStore {
    activeMap: ActiveMap | null;
    setActiveMap: (map: ActiveMap) => void;
    landProvinces: Province[];
    setLandProvinces: (provinces: Province[]) => void;
    waterProvinces: Province[];
    setWaterProvinces: (provinces: Province[]) => void;
    selectedProvince: Province | null;
    setSelectedProvince: (province: Province) => void;
    deselectProvince: () => void;
    syncProvinceType: (provinceId: number, type: "land" | "water") => void;
}

export const useMapStore = create<MapStore>((set) => ({
    activeMap: null,
    setActiveMap: (map: ActiveMap) => set({ activeMap: map }),
    landProvinces: [],
    setLandProvinces: (provinces: Province[]) => set({ landProvinces: provinces }),
    waterProvinces: [],
    setWaterProvinces: (provinces: Province[]) => set({ waterProvinces: provinces }),
    selectedProvince: null,
    setSelectedProvince: (province: Province) => set({ selectedProvince: province }),
    deselectProvince: () => set({ selectedProvince: null }),
    syncProvinceType: (provinceId, type) => {
        set((state) => ({
            landProvinces: state.landProvinces.map((province) =>
                province.id === provinceId ? { ...province, type } : province
            ),
            waterProvinces: state.waterProvinces.map((province) =>
                province.id === provinceId ? { ...province, type } : province
            ),
            selectedProvince:
                state.selectedProvince?.id === provinceId
                    ? { ...state.selectedProvince, type }
                    : state.selectedProvince,
        }));
    },
}));
