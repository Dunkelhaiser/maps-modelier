import { useQuery } from "@tanstack/react-query";

export const useGetMaps = () => {
    return useQuery({
        queryFn: async () => await window.electronAPI.getMaps(),
        queryKey: ["maps"],
    });
};
