import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EthnicityInput } from "src/shared/schemas/ethnicities/ethnicity";
import { GetEthnicitiesInput } from "src/shared/schemas/ethnicities/getEthnicities";

export const useGetAllEthnicities = (mapId: string, query?: GetEthnicitiesInput) => {
    return useQuery({
        queryFn: async () => await window.electron.ethnicities.getAll(mapId, query),
        queryKey: [mapId, "ethnicities"],
    });
};

export const useCreateEthnicity = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: EthnicityInput) => await window.electron.ethnicities.create(mapId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "ethnicities"] });
            toast.success("Ethnicity created successfully");
        },
    });
};

export const useUpdateEthnicity = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: EthnicityInput) => await window.electron.ethnicities.update(mapId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "ethnicities"] });
            toast.success("Ethnicity updated successfully");
        },
    });
};

export const useDeleteEthnicity = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electron.ethnicities.delete(mapId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "ethnicities"] });
            toast.success("Ethnicity deleted successfully");
        },
    });
};
