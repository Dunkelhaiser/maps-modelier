import { Province } from "@utils/types";
import { StateCreator } from "zustand";
import { AppStore } from "./store";

export interface ProvincesSlice {
    selectedProvinces: Province[];
    setSelectedProvinces: (province: Province, isShiftKey: boolean) => void;
    deselectProvinces: () => void;
}

export const initialProvincesSlice = {
    selectedProvinces: [],
};

export const createProvincesSlice: StateCreator<AppStore, [], [], ProvincesSlice> = (set, get) => ({
    ...initialProvincesSlice,
    setSelectedProvinces: (province: Province, isShiftKey: boolean) =>
        set((state) => {
            const { mode } = state;
            let { selectedState, selectedCountry } = state;

            if (selectedCountry && isShiftKey && mode === "countries_editing") {
                const stateToRemove = state.states.find((s) => s.provinces.includes(province.id));

                if (stateToRemove && selectedCountry.states.includes(stateToRemove.id)) {
                    get().removeStatesFromCountry(selectedCountry.tag, [stateToRemove.id]);
                    return {};
                }

                const stateToAdd = state.states.find((s) => s.provinces.includes(province.id));

                if (stateToAdd) {
                    get().addStatesToCountry(selectedCountry.tag, [stateToAdd.id]);
                }
                return {};
            }

            if (selectedState && isShiftKey && mode === "states_editing") {
                const isProvinceInState = selectedState.provinces.includes(province.id);

                if (isProvinceInState) {
                    get().removeProvincesFromState(selectedState.id, [province.id]);
                } else {
                    get().addProvincesToState([province.id]);
                }
                return {};
            }

            let selectedProvinces: Province[];

            if (!isShiftKey) {
                selectedProvinces = [province];
                selectedState = state.states.find((s) => s.provinces.includes(province.id)) ?? null;

                if (selectedState) {
                    selectedCountry =
                        state.countries.find((country) => country.states.includes(selectedState!.id)) ?? null;
                } else {
                    selectedCountry = null;
                }

                return {
                    selectedProvinces,
                    selectedState,
                    selectedCountry,
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
                selectedCountry = null;
            } else if (!selectedState && selectedProvinces.length > 0) {
                selectedState =
                    state.states.find((s) => selectedProvinces.every((p) => s.provinces.includes(p.id))) ?? null;

                if (selectedState) {
                    selectedCountry =
                        state.countries.find((country) => country.states.includes(selectedState!.id)) ?? null;
                } else {
                    selectedCountry = null;
                }
            }

            return {
                selectedProvinces,
                selectedState,
                selectedCountry,
            };
        }),

    deselectProvinces: () => set({ selectedProvinces: [], selectedState: null }),
});
