import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WarInput } from "src/shared/schemas/wars/war";

export const useGetWars = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "wars"],
        queryFn: async () => await window.electron.wars.getAll(mapId),
    });
};

export const useGetWar = (mapId: string, id: number) => {
    return useQuery({
        queryKey: [mapId, "wars", id],
        queryFn: async () => await window.electron.wars.get(mapId, id),
    });
};

export const useCreateWar = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: WarInput) => await window.electron.wars.create(mapId, data),
        onSuccess: () => {
            toast.success("War created successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "wars"] });
        },
    });
};

export const useUpdateWar = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: WarInput) => await window.electron.wars.update(mapId, id, data),
        onSuccess: () => {
            toast.success("War updated successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "wars"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "wars", id] });
        },
    });
};
