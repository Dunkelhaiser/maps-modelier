import { useQuery } from "@tanstack/react-query";

export const useGetWars = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "wars"],
        queryFn: async () => await window.electron.wars.getAll(mapId),
    });
};
