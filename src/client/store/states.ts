import { State } from "@utils/types";
import { StateCreator } from "zustand";
import { AppStore } from "./store";

export interface StatesSlice {
    selectedState: State | null;
}

export const initialStatesSlice = {
    selectedState: null,
};

export const createStatesSlice: StateCreator<AppStore, [], [], StatesSlice> = () => ({
    ...initialStatesSlice,
});
