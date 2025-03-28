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
        },
    });
};

export const useGetPoliticians = (mapId: string, countryId: number) => {
    return useQuery({
        queryKey: [mapId, countryId, "politicians"],
        queryFn: async () => await window.electron.politicians.getAll(mapId, countryId),
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

    return useMutation({
        mutationFn: async (data: PoliticianInput) => await window.electron.politicians.update(mapId, id, data),
        onSuccess: () => {
            toast.success("Politician updated successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "politicians", id] });
        },
    });
};

export const useDeletePolitician = (mapId: string, id: number) => {
    return useMutation({
        mutationFn: async () => await window.electron.politicians.delete(mapId, id),
        onSuccess: () => {
            toast.success("Politician deleted successfully");
        },
    });
};
