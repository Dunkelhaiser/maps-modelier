import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCountries = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "countries"],
        queryFn: async () => await window.electronAPI.getAllCountries(mapId),
    });
};

export const useCreateCountry = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name, tag, color }: { name: string; tag: string; color: string }) =>
            await window.electronAPI.createCountry(mapId, name, tag, color),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
        },
    });
};
