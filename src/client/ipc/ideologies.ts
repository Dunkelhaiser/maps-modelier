import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GetIdeologiesInput } from "src/shared/schemas/ideologies/getIdeologies";
import { IdeologyInput } from "src/shared/schemas/ideologies/ideology";

export const useGetAllIdeologies = (mapId: string, query?: GetIdeologiesInput) => {
    return useQuery({
        queryFn: async () => await window.electron.ideologies.getAll(mapId, query),
        queryKey: [mapId, "ideologies"],
    });
};

export const useCreateIdeology = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: IdeologyInput) => await window.electron.ideologies.create(mapId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "ideologies"] });
            toast.success("Ideology created successfully");
        },
    });
};

export const useUpdateIdeology = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: IdeologyInput) => await window.electron.ideologies.update(mapId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "ideologies"] });
            toast.success("Ideology updated successfully");
        },
    });
};

export const useDeleteIdeology = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electron.ideologies.delete(mapId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "ideologies"] });
            toast.success("Ideology deleted successfully");
        },
    });
};
