import { Country, Province, State } from "@utils/types";
import { StateCreator } from "zustand";
import { useSidebarStore } from "./sidebar";
import { MapStore, useMapStore } from "./store";
import { queryClient } from "@/main";

export interface ProvincesSlice {
    selectedProvinces: Province[];
    selectedState: State | null;
    selectedCountry: Country | null;
    selectProvince: (province: Province, isShiftKey: boolean, isRightClick: boolean) => void;
    deselectProvinces: () => void;
}

export const initialProvincesSlice = {
    selectedProvinces: [],
    selectedState: null,
    selectedCountry: null,
};

export const createProvincesSlice: StateCreator<MapStore, [], [], ProvincesSlice> = (set, get) => ({
    ...initialProvincesSlice,

    selectProvince: (province: Province, isShiftKey: boolean, isRightClick: boolean) => {
        const { activeSidebar, openSidebar } = useSidebarStore.getState();
        const { mode } = useMapStore.getState();

        if (isRightClick) {
            if (province.type === "water") {
                openSidebar("countries");
                return;
            }

            openSidebar(mode === "editing" ? "countries_editing" : "countries");
            const selectedState = findState(province.id, get().activeMap?.id);
            const selectedCountry = selectedState ? findCountry(selectedState.id, get().activeMap?.id) : null;
            set({ selectedCountry });
            return;
        }

        if (activeSidebar) return;

        if (isShiftKey) {
            const { selectedProvinces } = get();
            const isProvinceSelected = selectedProvinces.some((p) => p.id === province.id);

            if (isProvinceSelected) {
                const afterProvinceDisselection = selectedProvinces.filter((p) => p.id !== province.id);
                set({ selectedProvinces: afterProvinceDisselection });
            } else {
                set({ selectedProvinces: [...selectedProvinces, province] });
            }
        } else {
            const selectedState = findState(province.id, get().activeMap?.id);
            const selectedCountry = selectedState ? findCountry(selectedState.id, get().activeMap?.id) : null;

            set({
                selectedProvinces: [province],
                selectedState,
                selectedCountry,
            });
        }
    },

    deselectProvinces: () =>
        set({
            selectedProvinces: [],
            selectedState: null,
            selectedCountry: null,
        }),
});

const findState = (provinceId: number, mapId?: string) => {
    const [[, states]] = queryClient.getQueriesData<State[]>({ queryKey: [mapId, "states"] });
    return states?.find((s) => s.provinces.includes(provinceId)) ?? null;
};

const findCountry = (stateId: number, mapId?: string) => {
    const [[, countries]] = queryClient.getQueriesData<Country[]>({ queryKey: [mapId, "countries"] });
    return countries?.find((c) => c.states.includes(stateId)) ?? null;
};
