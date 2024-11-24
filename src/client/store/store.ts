import { ActiveMap, Province, State } from "@utils/types";
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
    states: State[];
    setStates: (states: State[]) => void;
    selectedState: State | null;
    addState: (stateName: string) => void;
    addProvincesToState: (provinceIds: number[]) => void;
    removeProvincesFromState: (provinceIds: number[]) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
    activeMap: null,
    setActiveMap: (map: ActiveMap) => set({ activeMap: map }),
    landProvinces: [],
    setLandProvinces: (provinces: Province[]) => set({ landProvinces: provinces }),
    waterProvinces: [],
    setWaterProvinces: (provinces: Province[]) => set({ waterProvinces: provinces }),
    selectedProvinces: [],
    setSelectedProvinces: (province: Province, isShiftKey: boolean) =>
        set((state) => {
            let selectedProvinces: Province[];
            let { selectedState } = state;

            if (!isShiftKey) {
                selectedProvinces = [province];
                return {
                    selectedProvinces,
                    selectedState: state.states.find((s) => s.provinces.includes(province.id)) ?? null,
                };
            }
            const isSelected = state.selectedProvinces.some((p) => p.id === province.id);
            if (isSelected) {
                selectedProvinces = state.selectedProvinces.filter((p) => p.id !== province.id);
            } else {
                selectedProvinces = [...state.selectedProvinces, province];

                if (selectedState) {
                    const isProvinceInState = selectedState.provinces.includes(province.id);

                    if (isProvinceInState) {
                        get().removeProvincesFromState([province.id]);
                    } else {
                        get().addProvincesToState([province.id]);
                    }
                }
            }

            if (!selectedState && selectedProvinces.length > 0) {
                selectedState =
                    state.states.find((s) => selectedProvinces.every((p) => s.provinces.includes(p.id))) ?? null;
            }

            return {
                selectedProvinces,
                selectedState,
            };
        }),

    deselectProvinces: () => set({ selectedProvinces: [], selectedState: null }),
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

    states: [],
    setStates: (states: State[]) => set({ states }),
    addState: async (stateName) => {
        const { activeMap, selectedProvinces } = get();

        if (!activeMap) return;

        const createdState = await window.electronAPI.createState(
            activeMap.id,
            stateName,
            selectedProvinces.map((province) => province.id)
        );

        set((currentState) => ({
            states: [...currentState.states, createdState],
            selectedState: createdState,
        }));
    },
    selectedState: null,

    addProvincesToState: async (provinceIds: number[]) => {
        const { activeMap, selectedState } = get();

        if (!activeMap || !selectedState) return;

        await window.electronAPI.addProvinces(activeMap.id, selectedState.id, provinceIds);

        const updatedState = {
            ...selectedState,
            provinces: [...new Set([...selectedState.provinces, ...provinceIds])],
        };

        set((state) => ({
            states: state.states.map((s) => {
                if (s.id === selectedState.id) {
                    return updatedState;
                }
                if (s.provinces.some((p) => provinceIds.includes(p))) {
                    return {
                        ...s,
                        provinces: s.provinces.filter((p) => !provinceIds.includes(p)),
                    };
                }
                return s;
            }),
            selectedState: updatedState,
        }));
    },
    removeProvincesFromState: async (provinceIds: number[]) => {
        const { activeMap, selectedState } = get();

        if (!activeMap || !selectedState) return;

        await window.electronAPI.removeProvinces(activeMap.id, provinceIds);

        const updatedState = {
            ...selectedState,
            provinces: selectedState.provinces.filter((id) => !provinceIds.includes(id)),
        };

        set((state) => ({
            states: state.states.map((s) => (s.id === selectedState.id ? updatedState : s)),
            selectedState: updatedState,
        }));
    },
}));
