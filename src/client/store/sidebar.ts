import { create } from "zustand";
import { useMapStore } from "./store";

export type Sidebar = "countries" | "ethnicities" | "alliances" | "wars" | "ideologies" | "parties" | null;

export interface SidebarStore {
    activeSidebar: Sidebar;
    openSidebar: (screen: Sidebar) => void;
    closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>()((set) => ({
    activeSidebar: null,
    openSidebar: (screen) => {
        useMapStore.getState().deselectProvinces();
        set({ activeSidebar: screen });
    },
    closeSidebar: () => {
        set({ activeSidebar: null });
        useMapStore.getState().deselectAlliance();
        useMapStore.getState().deselectWar();
        useMapStore.getState().deselectParty();
    },
}));
