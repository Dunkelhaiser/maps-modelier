import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAllEthnicities = (mapId: string) => {
    return useQuery({
        queryFn: async () => await window.electronAPI.getAllEthnicities(mapId),
        queryKey: ["ethnicities"],
    });
};

export const useDeleteEthnicity = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electronAPI.deleteEthnicity(mapId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ethnicities"] });
            toast.success("Ethnicity deleted successfully");
        },
    });
};

export const useRenameEthnicity = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (name: string) => await window.electronAPI.renameEthnicity(mapId, id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ethnicities"] });
            toast.success("Ethnicity renamed successfully");
        },
    });
};
