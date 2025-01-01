import { useMapStore } from "@store/store";

export const useActiveMap = () => {
    const activeMap = useMapStore((state) => state.activeMap);

    if (!activeMap) throw new Error("No active map set");

    return activeMap;
};
