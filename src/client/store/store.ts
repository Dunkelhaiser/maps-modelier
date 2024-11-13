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
        set((state) => {
            let newLandProvinces = state.landProvinces;
            let newWaterProvinces = state.waterProvinces;

            if (type === "water") {
                const landProvince = state.landProvinces.find((p) => p.id === provinceId);
                newLandProvinces = state.landProvinces.filter((p) => p.id !== provinceId);
                newWaterProvinces = landProvince
                    ? [...state.waterProvinces, { ...landProvince, type: "water" }]
                    : state.waterProvinces;
            } else {
                const waterProvince = state.waterProvinces.find((p) => p.id === provinceId);
                newWaterProvinces = state.waterProvinces.filter((p) => p.id !== provinceId);
                newLandProvinces = waterProvince
                    ? [...state.landProvinces, { ...waterProvince, type: "land" }]
                    : state.landProvinces;
            }

            return {
                landProvinces: newLandProvinces,
                waterProvinces: newWaterProvinces,
                selectedProvince:
                    state.selectedProvince?.id === provinceId
                        ? { ...state.selectedProvince, type }
                        : state.selectedProvince,
            };
        });
    },
}));
