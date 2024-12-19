import { Country, CountryProperties } from "@utils/types";
import { StateCreator } from "zustand";
import { AppStore } from "./store";

export interface CountriesSlice {
    countries: Country[];
    createCountry: (name: string, tag: string, color: string) => Promise<void>;
    setCountries: (countries: Country[]) => void;
    selectedCountry: Country | null;
    addStatesToCountry: (countryTag: string, stateIds: number[]) => void;
    removeStatesFromCountry: (countryTag: string, stateIds: number[]) => void;
    updateCountry: (tag: string, options: CountryProperties) => Promise<void>;
}

export const initialCountriesSlice = {
    countries: [],
    selectedCountry: null,
};

export const createCountriesSlice: StateCreator<AppStore, [], [], CountriesSlice> = (set, get) => ({
    ...initialCountriesSlice,
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
});
