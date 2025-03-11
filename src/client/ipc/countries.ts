import { useMapStore } from "@store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateCountryInput } from "src/shared/schemas/countries/createCountry";
import { StatesAssignmentInput } from "src/shared/schemas/countries/states";
import { UpdateCountryInput } from "src/shared/schemas/countries/updateCountry";

export const useGetCountries = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "countries"],
        queryFn: async () => await window.electron.countries.getAll(mapId),
    });
};

export const useCreateCountry = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateCountryInput) => await window.electron.countries.create(mapId, data),
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
        mutationFn: async (data: UpdateCountryInput) => await window.electron.countries.update(mapId, tag, data),
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
        mutationFn: async (data: StatesAssignmentInput) => await window.electron.countries.addStates(mapId, data),
        onSuccess: (_, { states }) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
            useMapStore.setState({
                selectedCountry: selectedCountry && {
                    ...selectedCountry,
                    states: [...new Set([...selectedCountry.states, ...states])],
                },
            });
        },
    });
};

export const useRemoveStates = (mapId: string) => {
    const queryClient = useQueryClient();
    const selectedCountry = useMapStore((state) => state.selectedCountry);

    return useMutation({
        mutationFn: async (data: StatesAssignmentInput) => await window.electron.countries.removeStates(mapId, data),
        onSuccess: (_, { states }) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
            useMapStore.setState({
                selectedCountry: selectedCountry && {
                    ...selectedCountry,
                    states: selectedCountry.states.filter((id) => !states.includes(id)),
                },
            });
        },
    });
};

export const useDeleteCountry = (mapId: string, tag: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electron.countries.delete(mapId, tag),
        onSuccess: () => {
            toast.success("Country deleted successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
        },
    });
};
