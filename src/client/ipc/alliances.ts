import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AddMembersInput } from "src/shared/schemas/alliances/addMembers";
import { AllianceInput } from "src/shared/schemas/alliances/alliance";

export const useCreateAlliance = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: AllianceInput) => await window.electron.alliances.create(mapId, data),
        onSuccess: () => {
            toast.success("Alliance created successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "alliances"] });
        },
    });
};

export const useGetAlliances = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "alliances"],
        queryFn: async () => await window.electron.alliances.getAll(mapId),
    });
};

export const useGetAlliance = (mapId: string, id: number) => {
    return useQuery({
        queryKey: [mapId, "alliances", id],
        queryFn: async () => await window.electron.alliances.get(mapId, id),
    });
};

export const useUpdateAlliance = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: AllianceInput) => await window.electron.alliances.update(mapId, id, data),
        onSuccess: () => {
            toast.success("Alliance updated successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "alliances", id] });
        },
    });
};

export const useGetMembers = (mapId: string, id: number) => {
    return useQuery({
        queryKey: [mapId, "alliances", id, "members"],
        queryFn: async () => await window.electron.alliances.getMembers(mapId, id),
    });
};

export const useAddMembers = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: AddMembersInput) => await window.electron.alliances.addMembers(mapId, id, data),
        onSuccess: () => {
            toast.success("Members added successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "alliances", id, "members"] });
        },
    });
};

export const useDeleteAlliance = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electron.alliances.delete(mapId, id),
        onSuccess: () => {
            toast.success("Alliance deleted successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "alliances"] });
        },
    });
};
