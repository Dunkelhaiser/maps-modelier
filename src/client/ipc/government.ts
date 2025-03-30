import { useMapStore } from "@store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PartyInput } from "src/shared/schemas/politics/addParties";
import { AssignHeadInput } from "src/shared/schemas/politics/assignHead";
import { ParliamentInput } from "src/shared/schemas/politics/parliament";

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

export const useCreateParliament = (mapId: string, countryId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ParliamentInput) =>
            await window.electron.government.createParliament(mapId, countryId, data),
        onSuccess: () => {
            toast.success("Parliament created successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, countryId, "parliament"] });
        },
    });
};

export const useUpdateParliament = (mapId: string, id: number) => {
    const queryClient = useQueryClient();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;

    return useMutation({
        mutationFn: async (data: ParliamentInput) => await window.electron.government.updateParliament(mapId, id, data),
        onSuccess: () => {
            toast.success("Parliament updated successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, selectedCountry, "parliament"] });
        },
    });
};

export const useGetParliament = (mapId: string, countryId: number) => {
    return useQuery({
        queryKey: [mapId, countryId, "parliament"],
        queryFn: async () => await window.electron.government.getParliament(mapId, countryId),
    });
};

export const useAddParties = (mapId: string, id: number) => {
    const queryClient = useQueryClient();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;

    return useMutation({
        mutationFn: async (data: PartyInput) => await window.electron.government.addParties(mapId, id, data),
        onSuccess: () => {
            toast.success("Parties added successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, selectedCountry, "parliament"] });
        },
    });
};

export const useGetParties = (mapId: string, id: number) => {
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;

    return useQuery({
        queryKey: [mapId, selectedCountry, "parliament", "parties"],
        queryFn: async () => await window.electron.government.getParties(mapId, id),
    });
};
