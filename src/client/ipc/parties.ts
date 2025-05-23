import { useMapStore } from "@store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AddMembersInput } from "src/shared/schemas/parties/addMembers";
import { GetPartiesInput } from "src/shared/schemas/parties/getParties";
import { PartyInput } from "src/shared/schemas/parties/party";

export const useGetParties = (mapId: string, countryId: number, query?: GetPartiesInput) => {
    return useQuery({
        queryKey: [mapId, countryId, "parties", query],
        queryFn: async () => await window.electron.parties.getAll(mapId, countryId, query),
    });
};

export const useGetParty = (mapId: string, id: number) => {
    return useQuery({
        queryKey: [mapId, "parties", id],
        queryFn: async () => await window.electron.parties.get(mapId, id),
    });
};

export const useGetMembers = (mapId: string, id: number) => {
    return useQuery({
        queryKey: [mapId, "parties", id, "members"],
        queryFn: async () => await window.electron.parties.getMembers(mapId, id),
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

export const useUpdateParty = (mapId: string, id: number) => {
    const queryClient = useQueryClient();
    const country = useMapStore((state) => state.selectedCountry)!;

    return useMutation({
        mutationFn: async (data: PartyInput) => await window.electron.parties.update(mapId, id, data),
        onSuccess: () => {
            toast.success("Party updated successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, country, "parties"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "parties", id] });
        },
    });
};

export const useAddMembers = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: AddMembersInput) => await window.electron.parties.addMembers(mapId, id, data),
        onSuccess: () => {
            toast.success("Members added successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "parties", id, "members"] });
        },
    });
};
