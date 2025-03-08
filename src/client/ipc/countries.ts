import { useMapStore } from "@store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CountryAttributes, DeepPartial } from "@utils/types";
import { toast } from "sonner";

export const useGetCountries = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "countries"],
        queryFn: async () => await window.electronAPI.getAllCountries(mapId),
    });
};

export const useCreateCountry = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CountryAttributes) => await window.electronAPI.createCountry(mapId, data),
        onSuccess: () => {
            toast.success("Country created successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
        },
    });
};

export const useUpdateCountry = (mapId: string, tag: string) => {
    const queryClient = useQueryClient();
    const selectedCountry = useMapStore((state) => state.selectedCountry);

    return useMutation({
        mutationFn: async (attributes: DeepPartial<CountryAttributes>) =>
            await window.electronAPI.updateCountry(mapId, tag, attributes),
        onSuccess: (data) => {
            toast.success("Country updated successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
            useMapStore.setState({ selectedCountry: selectedCountry && { ...selectedCountry, ...data } });
        },
    });
};

export const useAddStates = (mapId: string) => {
    const queryClient = useQueryClient();
    const selectedCountry = useMapStore((state) => state.selectedCountry);

    return useMutation({
        mutationFn: async ({ countryTag, stateIds }: { countryTag: string; stateIds: number[] }) =>
            await window.electronAPI.addStates(mapId, countryTag, stateIds),
        onSuccess: (_, { stateIds }) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
            useMapStore.setState({
                selectedCountry: selectedCountry && {
                    ...selectedCountry,
                    states: [...new Set([...selectedCountry.states, ...stateIds])],
                },
            });
        },
    });
};

export const useRemoveStates = (mapId: string) => {
    const queryClient = useQueryClient();
    const selectedCountry = useMapStore((state) => state.selectedCountry);

    return useMutation({
        mutationFn: async ({ countryTag, stateIds }: { countryTag: string; stateIds: number[] }) =>
            await window.electronAPI.removeStates(mapId, countryTag, stateIds),
        onSuccess: (_, { stateIds }) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
            useMapStore.setState({
                selectedCountry: selectedCountry && {
                    ...selectedCountry,
                    states: selectedCountry.states.filter((id) => !stateIds.includes(id)),
                },
            });
        },
    });
};

export const useDeleteCountry = (mapId: string, tag: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electronAPI.deleteCountry(mapId, tag),
        onSuccess: () => {
            toast.success("Country deleted successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
        },
    });
};
