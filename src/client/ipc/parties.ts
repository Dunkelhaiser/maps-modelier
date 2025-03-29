import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PartyInput } from "src/shared/schemas/parties/party";

export const useGetParties = (mapId: string, countryId: number) => {
    return useQuery({
        queryKey: [mapId, countryId, "parties"],
        queryFn: async () => await window.electron.parties.getAll(mapId, countryId),
    });
};

export const useGetParty = (mapId: string, id: number) => {
    return useQuery({
        queryKey: [mapId, "parties", id],
        queryFn: async () => await window.electron.parties.get(mapId, id),
    });
};

export const useCreateParty = (mapId: string, countryId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PartyInput) => await window.electron.parties.create(mapId, countryId, data),
        onSuccess: () => {
            toast.success("Party created successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, countryId, "parties"] });
        },
    });
};

export const useDeleteParty = (mapId: string, id: number) => {
    return useMutation({
        mutationFn: async () => await window.electron.parties.delete(mapId, id),
        onSuccess: () => {
            toast.success("Party deleted successfully");
        },
    });
};
