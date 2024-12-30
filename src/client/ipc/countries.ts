import { useAppStore } from "@store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CountryProperties } from "@utils/types";

export const useGetCountries = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "countries"],
        queryFn: async () => await window.electronAPI.getAllCountries(mapId),
    });
};

export const useCreateCountry = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name, tag, color }: { name: string; tag: string; color: string }) =>
            await window.electronAPI.createCountry(mapId, name, tag, color),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
        },
    });
};

export const useUpdateCountry = (mapId: string, tag: string) => {
    const queryClient = useQueryClient();
    const selectedCountry = useAppStore((state) => state.selectedCountry);

    return useMutation({
        mutationFn: async (options: CountryProperties) => await window.electronAPI.updateCountry(mapId, tag, options),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
            useAppStore.setState({ selectedCountry: selectedCountry && { ...selectedCountry, ...data } });
        },
    });
};

export const useAddStates = (mapId: string) => {
    const queryClient = useQueryClient();
    const selectedCountry = useAppStore((state) => state.selectedCountry);

    return useMutation({
        mutationFn: async ({ countryTag, stateIds }: { countryTag: string; stateIds: number[] }) =>
            await window.electronAPI.addStates(mapId, countryTag, stateIds),
        onSuccess: (_, { stateIds }) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
            useAppStore.setState({
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
    const selectedCountry = useAppStore((state) => state.selectedCountry);

    return useMutation({
        mutationFn: async ({ countryTag, stateIds }: { countryTag: string; stateIds: number[] }) =>
            await window.electronAPI.removeStates(mapId, countryTag, stateIds),
        onSuccess: (_, { stateIds }) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
            useAppStore.setState({
                selectedCountry: selectedCountry && {
                    ...selectedCountry,
                    states: selectedCountry.states.filter((id) => !stateIds.includes(id)),
                },
            });
        },
    });
};
