import { useMapStore } from "@store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PoliticianInput } from "src/shared/schemas/politics/politician";

export const useCreatePolitician = (mapId: string, countryId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PoliticianInput) => await window.electron.politicians.create(mapId, countryId, data),
        onSuccess: () => {
            toast.success("Politician created successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, countryId, "politicians"] });
            queryClient.invalidateQueries({ queryKey: [mapId, countryId, "politicians", "independent"] });
        },
    });
};

export const useGetPoliticians = (mapId: string, countryId: number) => {
    return useQuery({
        queryKey: [mapId, countryId, "politicians"],
        queryFn: async () => await window.electron.politicians.getAll(mapId, countryId),
    });
};

export const useGetIndependent = (mapId: string, countryId: number) => {
    return useQuery({
        queryKey: [mapId, countryId, "politicians", "independent"],
        queryFn: async () => await window.electron.politicians.getIndependent(mapId, countryId),
    });
};

export const useGetPolitician = (mapId: string, id: number) => {
    return useQuery({
        queryKey: [mapId, "politicians", id],
        queryFn: async () => await window.electron.politicians.get(mapId, id),
    });
};

export const useUpdatePolitician = (mapId: string, id: number) => {
    const queryClient = useQueryClient();
    const selectedCountry = useMapStore((state) => state.selectedCountry);

    return useMutation({
        mutationFn: async (data: PoliticianInput) => await window.electron.politicians.update(mapId, id, data),
        onSuccess: () => {
            toast.success("Politician updated successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "politicians", id] });
            queryClient.invalidateQueries({ queryKey: [mapId, selectedCountry, "politicians"] });
            queryClient.invalidateQueries({ queryKey: [mapId, selectedCountry, "politicians", "independent"] });
        },
    });
};

export const useDeletePolitician = (mapId: string, id: number) => {
    const queryClient = useQueryClient();
    const selectedCountry = useMapStore((state) => state.selectedCountry);

    return useMutation({
        mutationFn: async () => await window.electron.politicians.delete(mapId, id),
        onSuccess: () => {
            toast.success("Politician deleted successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, selectedCountry, "politicians"] });
            queryClient.invalidateQueries({ queryKey: [mapId, selectedCountry, "politicians", "independent"] });
        },
    });
};
