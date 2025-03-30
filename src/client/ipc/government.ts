import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AssignHeadInput } from "src/shared/schemas/politics/assignHead";

export const useGetHeadOfState = (mapId: string, countryId: number) => {
    return useQuery({
        queryKey: [mapId, countryId, "head_of_state"],
        queryFn: async () => await window.electron.government.getHeadOfState(mapId, countryId),
    });
};

export const useGetHeadOfGovernment = (mapId: string, countryId: number) => {
    return useQuery({
        queryKey: [mapId, countryId, "head_of_government"],
        queryFn: async () => await window.electron.government.getHeadOfGovernment(mapId, countryId),
    });
};

export const useAssignHeadOfState = (mapId: string, countryId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: AssignHeadInput) =>
            await window.electron.government.assignHeadOfState(mapId, countryId, data),
        onSuccess: () => {
            toast.success("Head of state assigned successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, countryId, "head_of_state"] });
        },
    });
};

export const useAssignHeadOfGovernment = (mapId: string, countryId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: AssignHeadInput) =>
            await window.electron.government.assignHeadOfGovernment(mapId, countryId, data),
        onSuccess: () => {
            toast.success("Head of government assigned successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, countryId, "head_of_government"] });
        },
    });
};
