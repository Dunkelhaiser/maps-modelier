import { ActiveMap, Province, State } from "@utils/types";
import { create } from "zustand";

type Mode = "viewing" | "provinces_editing" | "states_editing";

interface MapStore {
    mode: Mode;
    setMode: (mode: Mode) => void;
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
    addState: (stateName: string) => Promise<void>;
    addProvincesToState: (provinceIds: number[]) => void;
    removeProvincesFromState: (provinceIds: number[]) => void;
    renameState: (name: string) => Promise<void>;
}

export const useMapStore = create<MapStore>((set, get) => ({
    mode: "viewing",
    setMode: (mode) => set({ mode }),
    activeMap: null,
    setActiveMap: (map: ActiveMap) => set({ activeMap: map }),
    landProvinces: [],
    setLandProvinces: (provinces: Province[]) => set({ landProvinces: provinces }),
    waterProvinces: [],
    setWaterProvinces: (provinces: Province[]) => set({ waterProvinces: provinces }),
    selectedProvinces: [],
    setSelectedProvinces: (province: Province, isShiftKey: boolean) =>
        set((state) => {
            const { mode } = state;
            let { selectedState } = state;

            if (selectedState && isShiftKey && mode === "states_editing") {
                const isProvinceInState = selectedState.provinces.includes(province.id);

                if (isProvinceInState) {
                    get().removeProvincesFromState([province.id]);
                } else {
                    get().addProvincesToState([province.id]);
                }
                return {};
            }

            let selectedProvinces: Province[];
            if (!isShiftKey) {
                selectedProvinces = [province];
                selectedState = state.states.find((s) => s.provinces.includes(province.id)) ?? null;
                return {
                    selectedProvinces,
                    selectedState,
                };
            }

            const isSelected = state.selectedProvinces.some((p) => p.id === province.id);
            if (isSelected) {
                selectedProvinces = state.selectedProvinces.filter((p) => p.id !== province.id);
            } else {
                selectedProvinces = [...state.selectedProvinces, province];
            }

            if (selectedProvinces.length === 0) {
                selectedState = null;
            } else if (!selectedState && selectedProvinces.length > 0) {
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
            const affectedStates = state.states.filter((s) =>
                s.provinces.some((provinceId) => provinceIds.includes(provinceId))
            );

            const allProvinceIdsToChange = new Set([...provinceIds, ...affectedStates.flatMap((s) => s.provinces)]);

            let newLandProvinces = [...state.landProvinces];
            let newWaterProvinces = [...state.waterProvinces];

            allProvinceIdsToChange.forEach((provinceId) => {
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
                allProvinceIdsToChange.has(province.id) ? { ...province, type } : province
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

        const provinceTypes = new Set(selectedProvinces.map((province) => province.type));
        if (provinceTypes.size > 1) {
            throw new Error("Cannot create a state with provinces of different types");
        }

        const affectedStates = get().states.filter((state) =>
            state.provinces.some((provinceId) => selectedProvinces.some((province) => province.id === provinceId))
        );

        const createdState = await window.electronAPI.createState(
            activeMap.id,
            stateName,
            selectedProvinces.map((province) => province.id)
        );

        set((currentState) => {
            const updatedStates = currentState.states
                .map((state) => {
                    if (affectedStates.some((affectedState) => affectedState.id === state.id)) {
                        return {
                            ...state,
                            provinces: state.provinces.filter(
                                (provinceId) => !selectedProvinces.some((province) => province.id === provinceId)
                            ),
                        };
                    }
                    return state;
                })
                .concat(createdState);

            return {
                states: updatedStates,
                selectedState: createdState,
            };
        });
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

        set((state) => {
            const remainingSelectedProvinces = state.selectedProvinces.filter(
                (province) => !provinceIds.includes(province.id)
            );

            return {
                states: state.states.map((s) => (s.id === selectedState.id ? updatedState : s)),
                selectedState: remainingSelectedProvinces.length > 0 ? updatedState : null,
                selectedProvinces: remainingSelectedProvinces,
            };
        });
    },

    renameState: async (name: string) => {
        const { activeMap, selectedState } = get();

        if (!activeMap) return;
        if (!selectedState) return;

        const updatedState = await window.electronAPI.renameState(activeMap.id, selectedState.id, name);

        set((state) => ({
            states: state.states.map((s) =>
                s.id === selectedState.id ? { ...updatedState, provinces: selectedState.provinces } : s
            ),
            selectedState: { ...updatedState, provinces: selectedState.provinces },
        }));
    },
}));
