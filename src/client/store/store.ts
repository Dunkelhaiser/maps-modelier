import { ActiveMap, Province } from "@utils/types";
import { create } from "zustand";

interface MapStore {
    activeMap: ActiveMap | null;
    setActiveMap: (map: ActiveMap) => void;
    landProvinces: Province[];
    setLandProvinces: (provinces: Province[]) => void;
    waterProvinces: Province[];
    setWaterProvinces: (provinces: Province[]) => void;
    selectedProvinces: Province[];
    setSelectedProvinces: (province: Province, isShiftKey: boolean) => void;
    deselectProvinces: () => void;
    syncProvinceType: (provinceIds: number[], type: "land" | "water") => void;
}

export const useMapStore = create<MapStore>((set) => ({
    activeMap: null,
    setActiveMap: (map: ActiveMap) => set({ activeMap: map }),
    landProvinces: [],
    setLandProvinces: (provinces: Province[]) => set({ landProvinces: provinces }),
    waterProvinces: [],
    setWaterProvinces: (provinces: Province[]) => set({ waterProvinces: provinces }),
    selectedProvinces: [],
    setSelectedProvinces: (province: Province, isShiftKey: boolean) =>
        set((state) => {
            if (!isShiftKey) {
                return { selectedProvinces: [province] };
            }

            const isSelected = state.selectedProvinces.some((p) => p.id === province.id);

            if (isSelected) {
                return {
                    selectedProvinces: state.selectedProvinces.filter((p) => p.id !== province.id),
                };
            }
            return {
                selectedProvinces: [...state.selectedProvinces, province],
            };
        }),

    deselectProvinces: () => set({ selectedProvinces: [] }),
    syncProvinceType: (provinceIds, type) => {
        set((state) => {
            let newLandProvinces = [...state.landProvinces];
            let newWaterProvinces = [...state.waterProvinces];

            provinceIds.forEach((provinceId) => {
                if (type === "water") {
                    const landProvince = state.landProvinces.find((p) => p.id === provinceId);
                    newLandProvinces = newLandProvinces.filter((p) => p.id !== provinceId);
                    if (landProvince) {
                        newWaterProvinces = [...newWaterProvinces, { ...landProvince, type: "water" }];
                    }
                } else {
                    const waterProvince = state.waterProvinces.find((p) => p.id === provinceId);
                    newWaterProvinces = newWaterProvinces.filter((p) => p.id !== provinceId);
                    if (waterProvince) {
                        newLandProvinces = [...newLandProvinces, { ...waterProvince, type: "land" }];
                    }
                }
            });

            const updatedSelectedProvinces = state.selectedProvinces.map((province) =>
                provinceIds.includes(province.id) ? { ...province, type } : province
            );

            return {
                landProvinces: newLandProvinces,
                waterProvinces: newWaterProvinces,
                selectedProvinces: updatedSelectedProvinces,
            };
        });
    },
}));
