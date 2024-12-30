import { State } from "@utils/types";
import { StateCreator } from "zustand";
import { AppStore } from "./store";

export interface StatesSlice {
    states: State[];
    setStates: (states: State[]) => void;
    selectedState: State | null;
    addProvincesToState: (provinceIds: number[]) => void;
    removeProvincesFromState: (stateId: number, provinceIds: number[]) => void;
    renameState: (name: string) => Promise<void>;
    deleteState: () => Promise<void>;
}

export const initialStatesSlice = {
    states: [],
    selectedState: null,
};

export const createStatesSlice: StateCreator<AppStore, [], [], StatesSlice> = (set, get) => ({
    ...initialStatesSlice,
    setStates: (states: State[]) => set({ states }),
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
