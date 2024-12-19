import { State } from "@utils/types";
import { StateCreator } from "zustand";
import { AppStore } from "./store";

export interface StatesSlice {
    states: State[];
    setStates: (states: State[]) => void;
    selectedState: State | null;
    addState: (stateName: string) => Promise<void>;
    addProvincesToState: (provinceIds: number[]) => void;
    removeProvincesFromState: (stateId: number, provinceIds: number[]) => void;
    renameState: (name: string) => Promise<void>;
    deleteState: () => Promise<void>;
}

export const createStatesSlice: StateCreator<AppStore, [], [], StatesSlice> = (set, get) => ({
    states: [],
    setStates: (states: State[]) => set({ states }),
    selectedState: null,
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
    removeProvincesFromState: async (stateId, provinceIds) => {
        const { activeMap, selectedState } = get();

        if (!activeMap || !selectedState) return;

        await window.electronAPI.removeProvinces(activeMap.id, stateId, provinceIds);

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
    deleteState: async () => {
        const { activeMap, selectedState } = get();

        if (!activeMap) return;
        if (!selectedState) return;

        await window.electronAPI.deleteState(activeMap.id, selectedState.id);

        set((state) => ({
            states: state.states.filter((s) => s.id !== selectedState.id),
            selectedState: null,
            selectedProvinces: [],
        }));
    },
});
