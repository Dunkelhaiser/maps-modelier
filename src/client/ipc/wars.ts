import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AddParticipantsInput } from "src/shared/schemas/wars/addParticipants";
import { GetWarsInput } from "src/shared/schemas/wars/getWars";
import { WarInput } from "src/shared/schemas/wars/war";

export const useGetWars = (mapId: string, query?: GetWarsInput) => {
    return useQuery({
        queryKey: [mapId, "wars", query],
        queryFn: async () => await window.electron.wars.getAll(mapId, query),
    });
};

export const useGetWar = (mapId: string, id: number) => {
    return useQuery({
        queryKey: [mapId, "wars", id],
        queryFn: async () => await window.electron.wars.get(mapId, id),
    });
};

export const useGetParticipants = (mapId: string, id: number) => {
    return useQuery({
        queryKey: [mapId, "wars", id, "participants"],
        queryFn: async () => await window.electron.wars.getParticipants(mapId, id),
    });
};

export const useAddParticipants = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: AddParticipantsInput) => await window.electron.wars.addParticipants(mapId, id, data),
        onSuccess: () => {
            toast.success("Participants added successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "wars", id, "participants"] });
        },
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

export const useDeleteWar = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electron.wars.delete(mapId, id),
        onSuccess: () => {
            toast.success("War deleted successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "wars"] });
        },
    });
};
