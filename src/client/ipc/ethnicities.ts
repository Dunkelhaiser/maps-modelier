import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EthnicityInput } from "src/shared/schemas/ethnicities/ethnicity";

export const useGetAllEthnicities = (mapId: string) => {
    return useQuery({
        queryFn: async () => await window.electron.ethnicities.getAll(mapId),
        queryKey: ["ethnicities"],
    });
};

export const useCreateEthnicity = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: EthnicityInput) => await window.electron.ethnicities.create(mapId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ethnicities"] });
            toast.success("Ethnicity created successfully");
        },
    });
};

export const useRenameEthnicity = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (name: string) => await window.electron.ethnicities.rename(mapId, id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ethnicities"] });
            toast.success("Ethnicity renamed successfully");
        },
    });
};

export const useDeleteEthnicity = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electron.ethnicities.delete(mapId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ethnicities"] });
            toast.success("Ethnicity deleted successfully");
        },
    });
};
