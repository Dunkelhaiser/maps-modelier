import { useQuery } from "@tanstack/react-query";

export const useGetStates = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "states"],
        queryFn: async () => await window.electronAPI.getAllStates(mapId),
    });
};
