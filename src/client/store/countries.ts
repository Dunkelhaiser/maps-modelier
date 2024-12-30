import { Country } from "@utils/types";
import { StateCreator } from "zustand";
import { AppStore } from "./store";

export interface CountriesSlice {
    selectedCountry: Country | null;
}

export const initialCountriesSlice = {
    selectedCountry: null,
};

export const createCountriesSlice: StateCreator<AppStore, [], [], CountriesSlice> = () => ({
    ...initialCountriesSlice,
});
