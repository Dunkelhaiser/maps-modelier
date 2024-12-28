import { useQuery } from "@tanstack/react-query";

export const useGetCountries = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "countries"],
        queryFn: async () => await window.electronAPI.getAllCountries(mapId),
    });
};
