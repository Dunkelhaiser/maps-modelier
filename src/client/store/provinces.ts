import { CountryStates, Province, State } from "src/shared/types";
import { StateCreator } from "zustand";
import { useSidebarStore } from "./sidebar";
import { MapStore } from "./store";
import { queryClient } from "@/main";

export interface ProvincesSlice {
    selectedProvinces: Province[];
    selectedState: State | null;
    selectedCountry: string | null;
    selectedAlliance: number | null;
    selectProvince: (province: Province, isShiftKey: boolean, isRightClick: boolean) => void;
    deselectProvinces: () => void;
    selectCountry: (tag: string | null) => void;
    selectAlliance: (alliance: number | null) => void;
    deselectAlliance: () => void;
}

export const initialProvincesSlice = {
    selectedProvinces: [],
    selectedState: null,
    selectedCountry: null,
    selectedAlliance: null,
};

export const createProvincesSlice: StateCreator<MapStore, [], [], ProvincesSlice> = (set, get) => ({
    ...initialProvincesSlice,

    selectProvince: (province: Province, isShiftKey: boolean, isRightClick: boolean) => {
        const { activeSidebar } = useSidebarStore.getState();
        const { selectCountry } = get();

        if (isRightClick) {
            const selectedState = findState(province.id, get().activeMap);
            const selectedCountry = selectedState ? findCountry(selectedState.id, get().activeMap) : null;

            selectCountry(selectedCountry);
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
            const selectedState = findState(province.id, get().activeMap);
            const selectedCountry = selectedState ? findCountry(selectedState.id, get().activeMap) : null;

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

    selectCountry: (tag) => {
        useSidebarStore.getState().openSidebar("countries");
        set({ selectedCountry: tag });
    },

    selectAlliance: (alliance) => {
        useSidebarStore.getState().openSidebar("alliances");
        set({ selectedAlliance: alliance });
    },

    deselectAlliance: () => set({ selectedAlliance: null }),
});

const findState = (provinceId: number, mapId?: string | null) => {
    const [[, states]] = queryClient.getQueriesData<State[]>({ queryKey: [mapId, "states"] });
    return states?.find((s) => s.provinces.includes(provinceId)) ?? null;
};

const findCountry = (stateId: number, mapId?: string | null) => {
    const [[, countries]] = queryClient.getQueriesData<CountryStates[]>({ queryKey: [mapId, "countries_states"] });
    return countries?.find((c) => c.states.includes(stateId))?.tag ?? null;
};
