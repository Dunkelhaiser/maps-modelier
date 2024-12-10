import { ActiveMap, Country, CountryProperties, Province, State } from "@utils/types";
import { create } from "zustand";

type Mode = "viewing" | "provinces_editing" | "states_editing" | "countries_editing";

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
    removeProvincesFromState: (stateId: number, provinceIds: number[]) => void;
    renameState: (name: string) => Promise<void>;
    deleteState: () => Promise<void>;
    closeMap: () => void;
    countries: Country[];
    createCountry: (name: string, tag: string, color: string) => Promise<void>;
    setCountries: (countries: Country[]) => void;
    selectedCountry: Country | null;
    addStatesToCountry: (countryTag: string, stateIds: number[]) => void;
    removeStatesFromCountry: (countryTag: string, stateIds: number[]) => void;
    updateCountry: (tag: string, options: CountryProperties) => Promise<void>;
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
                selectedState: state.selectedState && { ...state.selectedState, type },
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

    closeMap: () => {
        set({
            mode: "viewing",
            activeMap: null,
            landProvinces: [],
            waterProvinces: [],
            selectedProvinces: [],
            states: [],
            selectedState: null,
        });
    },

    countries: [],
    createCountry: async (name, tag, color) => {
        const { activeMap, selectedState, countries } = get();

        if (!activeMap) return;

        const createdCountry = await window.electronAPI.createCountry(activeMap.id, name, tag, color);

        const isStateUnassigned = !countries.some((country) => country.states.includes(selectedState?.id ?? -1));

        set((state) => {
            const updatedCountries = [...state.countries, { ...createdCountry, states: [] }].sort((a, b) =>
                a.name.localeCompare(b.name)
            );

            if (selectedState && isStateUnassigned) {
                const updatedCountriesWithState = updatedCountries.map((country) => {
                    if (country.tag === createdCountry.tag) {
                        return {
                            ...country,
                            states: [selectedState.id],
                        };
                    }
                    return country;
                });

                get().addStatesToCountry(createdCountry.tag, [selectedState.id]);

                return {
                    countries: updatedCountriesWithState,
                    selectedCountry: { ...createdCountry, states: [selectedState.id] },
                };
            }

            return {
                countries: updatedCountries,
                selectedCountry: { ...createdCountry, states: [] },
            };
        });
    },
    setCountries: (countries: Country[]) => set({ countries }),
    selectedCountry: null,
    addStatesToCountry: async (countryTag, stateIds) => {
        const { activeMap } = get();

        if (!activeMap) return;

        const currentCountry = get().countries.find((country) =>
            country.states.some((stateId) => stateIds.includes(stateId))
        );

        await window.electronAPI.addStates(activeMap.id, countryTag, stateIds);

        set((state) => {
            const updatedCountries = state.countries.map((country) => {
                if (country.tag === countryTag) {
                    return {
                        ...country,
                        states: [...new Set([...country.states, ...stateIds])],
                    };
                }
                if (currentCountry && country.tag === currentCountry.tag) {
                    return {
                        ...country,
                        states: country.states.filter((stateId) => !stateIds.includes(stateId)),
                    };
                }
                return country;
            });

            const updatedSelectedCountry =
                updatedCountries.find((country) => country.tag === state.selectedCountry?.tag) ?? null;

            return {
                countries: updatedCountries,
                selectedCountry: updatedSelectedCountry && {
                    ...updatedSelectedCountry,
                    states: updatedSelectedCountry.states,
                },
                selectedState:
                    state.selectedState &&
                    updatedCountries.some((country) => country.states.includes(state.selectedState?.id ?? -1))
                        ? state.selectedState
                        : null,
            };
        });
    },

    removeStatesFromCountry: async (countryTag, stateIds) => {
        const { activeMap } = get();

        if (!activeMap) return;

        await window.electronAPI.removeStates(activeMap.id, countryTag, stateIds);

        set((state) => {
            const updatedCountries = state.countries.map((country) => {
                if (country.tag === countryTag) {
                    return {
                        ...country,
                        states: country.states.filter((stateId) => !stateIds.includes(stateId)),
                    };
                }
                return country;
            });

            const updatedSelectedCountry =
                updatedCountries.find((country) => country.tag === state.selectedCountry?.tag) ?? null;

            return {
                countries: updatedCountries,
                selectedCountry: updatedSelectedCountry && {
                    ...updatedSelectedCountry,
                    states: updatedSelectedCountry.states,
                },
                selectedState:
                    state.selectedState &&
                    updatedCountries.some((country) => country.states.includes(state.selectedState?.id ?? -1))
                        ? state.selectedState
                        : null,
            };
        });
    },

    updateCountry: async (tag, options) => {
        const { activeMap } = get();

        if (!activeMap) return;

        const updatedCountry = await window.electronAPI.updateCountry(activeMap.id, tag, options);

        set((state) => {
            const { selectedCountry } = state;
            const updatedCountries = state.countries.map((country) => {
                if (country.tag === tag) {
                    return {
                        ...country,
                        ...updatedCountry,
                    };
                }
                return country;
            });

            const updatedSelectedCountry =
                selectedCountry?.tag === tag ? { ...selectedCountry, ...updatedCountry } : selectedCountry;

            return {
                countries: updatedCountries,
                selectedCountry: updatedSelectedCountry,
            };
        });
    },
}));
