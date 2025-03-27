import { create } from "zustand";
import { useMapStore } from "./store";

export type Sidebar = "countries" | "ethnicities" | "alliances" | "wars" | "ideologies" | null;

export interface SidebarStore {
    activeSidebar: Sidebar;
    openSidebar: (screen: Sidebar) => void;
    closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>()((set) => ({
    activeSidebar: null,
    openSidebar: (screen) => {
        useMapStore.getState().deselectProvinces();
        useMapStore.getState().deselectAlliance();
        useMapStore.getState().deselectWar();
        set({ activeSidebar: screen });
    },
    closeSidebar: () => set({ activeSidebar: null }),
}));
