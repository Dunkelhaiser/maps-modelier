import { Province } from "@utils/types";
import { StateCreator } from "zustand";
import { AppStore } from "./store";

export interface ProvincesSlice {
    landProvinces: Province[];
    setLandProvinces: (provinces: Province[]) => void;
    waterProvinces: Province[];
    setWaterProvinces: (provinces: Province[]) => void;
    selectedProvinces: Province[];
    setSelectedProvinces: (province: Province, isShiftKey: boolean) => void;
    deselectProvinces: () => void;
    syncProvinceType: (provinceIds: number[], type: "land" | "water") => void;
}

export const initialProvincesSlice = {
    landProvinces: [],
    waterProvinces: [],
    selectedProvinces: [],
};

export const createProvincesSlice: StateCreator<AppStore, [], [], ProvincesSlice> = (set, get) => ({
    ...initialProvincesSlice,
    setLandProvinces: (provinces: Province[]) => set({ landProvinces: provinces }),
    setWaterProvinces: (provinces: Province[]) => set({ waterProvinces: provinces }),
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
    syncProvinceType: (provinceIds, type) => {
        set((state) => {
            const affectedStates = state.states.filter((s) =>
                s.provinces.some((provinceId) => provinceIds.includes(provinceId))
            );

            const allProvinceIdsToChange = new Set([...provinceIds, ...affectedStates.flatMap((s) => s.provinces)]);

            let newLandProvinces = [...state.landProvinces];
            let newWaterProvinces = [...state.waterProvinces];
            let newCountries = [...state.countries];

            if (type === "water") {
                newCountries = newCountries.map((country) => ({
                    ...country,
                    states: country.states.filter(
                        (stateId) => !affectedStates.some((affectedState) => affectedState.id === stateId)
                    ),
                }));
            }

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

            const newStates = state.states.map((s) => ({ ...s, type }));

            const updatedSelectedProvinces = state.selectedProvinces.map((province) =>
                allProvinceIdsToChange.has(province.id) ? { ...province, type } : province
            );

            return {
                landProvinces: newLandProvinces,
                waterProvinces: newWaterProvinces,
                selectedProvinces: updatedSelectedProvinces,
                states: newStates,
                countries: newCountries,
                selectedState: state.selectedState && { ...state.selectedState, type },
            };
        });
    },
});
