import { useQuery } from "@tanstack/react-query";

export const useGetAllEthnicities = (mapId: string) => {
    return useQuery({
        queryFn: async () => await window.electronAPI.getAllEthnicities(mapId),
        queryKey: ["ethnicities"],
    });
};
