import { create } from "zustand";

export type Screen = "countries" | "countries_editing" | "ethnicities" | null;

export interface SidebarStore {
    screen: Screen;
    setScreen: (screen: Screen) => void;
    closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>()((set) => ({
    screen: null,
    setScreen: (screen) => set({ screen }),
    closeSidebar: () => set({ screen: null }),
}));
