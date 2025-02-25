import { create } from "zustand";

export type Sidebar = "countries" | "countries_editing" | "ethnicities" | null;

export interface SidebarStore {
    activeSidebar: Sidebar;
    openSidebar: (screen: Sidebar) => void;
    closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>()((set) => ({
    activeSidebar: null,
    openSidebar: (screen) => set({ activeSidebar: screen }),
    closeSidebar: () => set({ activeSidebar: null }),
}));
