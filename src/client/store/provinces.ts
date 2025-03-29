import { CountryStates, Province, State } from "src/shared/types";
import { StateCreator } from "zustand";
import { useSidebarStore } from "./sidebar";
import { MapStore } from "./store";
import { queryClient } from "@/main";

export interface ProvincesSlice {
    selectedProvinces: Province[];
    selectedState: number | null;
    selectedCountry: number | null;
    selectedAlliance: number | null;
    selectedWar: number | null;
    selectedParty: number | null;
    selectProvince: (province: Province, isShiftKey: boolean, isRightClick: boolean) => void;
    deselectProvinces: () => void;
    selectCountry: (id: number | null) => void;
    selectAlliance: (alliance: number | null) => void;
    deselectAlliance: () => void;
    selectWar: (war: number | null) => void;
    deselectWar: () => void;
    selectParty: (party: number | null) => void;
    deselectParty: () => void;
}

export const initialProvincesSlice = {
    selectedProvinces: [],
    selectedState: null,
    selectedCountry: null,
    selectedAlliance: null,
    selectedWar: null,
    selectedParty: null,
};

export const createProvincesSlice: StateCreator<MapStore, [], [], ProvincesSlice> = (set, get) => ({
    ...initialProvincesSlice,

    selectProvince: (province: Province, isShiftKey: boolean, isRightClick: boolean) => {
        const { activeSidebar } = useSidebarStore.getState();
        const { selectCountry } = get();

        if (isRightClick) {
            const selectedState = findState(province.id, get().activeMap);
            const selectedCountry = selectedState ? findCountry(selectedState, get().activeMap) : null;

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
            const selectedCountry = selectedState ? findCountry(selectedState, get().activeMap) : null;

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

    selectCountry: (id) => {
        useSidebarStore.getState().openSidebar("countries");
        set({ selectedCountry: id });
    },

    selectAlliance: (alliance) => {
        useSidebarStore.getState().openSidebar("alliances");
        set({ selectedAlliance: alliance });
    },

    deselectAlliance: () => set({ selectedAlliance: null }),

    selectParty: (party) => {
        const { selectedCountry } = get();
        useSidebarStore.getState().openSidebar("parties");
        set({ selectedParty: party, selectedCountry });
    },

    deselectParty: () => set({ selectedParty: null }),

    selectWar: (war) => {
        useSidebarStore.getState().openSidebar("wars");
        set({ selectedWar: war });
    },

    deselectWar: () => set({ selectedWar: null }),
});

const findState = (provinceId: number, mapId?: string | null) => {
    const [[, states]] = queryClient.getQueriesData<State[]>({ queryKey: [mapId, "states"] });
    return states?.find((s) => s.provinces.includes(provinceId))?.id ?? null;
};

const findCountry = (stateId: number, mapId?: string | null) => {
    const [[, countries]] = queryClient.getQueriesData<CountryStates[]>({ queryKey: [mapId, "countries_states"] });
    return countries?.find((c) => c.states.includes(stateId))?.id ?? null;
};
