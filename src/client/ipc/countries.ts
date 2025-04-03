import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateCountryInput } from "src/shared/schemas/countries/createCountry";
import { GetCountriesInput } from "src/shared/schemas/countries/getCountries";
import { StatesAssignmentInput } from "src/shared/schemas/countries/states";
import { UpdateCountryInput } from "src/shared/schemas/countries/updateCountry";
import { PopulationInput } from "src/shared/schemas/provinces/population";

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

export const useUpdateCountry = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateCountryInput) => await window.electron.countries.update(mapId, id, data),
        onSuccess: () => {
            toast.success("Country updated successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "countries_states"] });
        },
    });
};

export const useAddStates = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: StatesAssignmentInput) => await window.electron.countries.addStates(mapId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "countries_states"] });
        },
    });
};

export const useRemoveStates = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: StatesAssignmentInput) => await window.electron.countries.removeStates(mapId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "countries_states"] });
        },
    });
};

export const useDeleteCountry = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electron.countries.delete(mapId, id),
        onSuccess: () => {
            toast.success("Country deleted successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
        },
    });
};

export const useGetCountriesStates = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "countries_states"],
        queryFn: async () => await window.electron.countries.getStates(mapId),
    });
};

export const useGetCountryById = (mapId: string, id: number | null) => {
    return useQuery({
        queryKey: [mapId, "countries", id],
        queryFn: async () => (id ? await window.electron.countries.getById(mapId, id) : null),
        enabled: id !== null,
    });
};

export const useGetCountriesBase = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "countries_base"],
        queryFn: async () => await window.electron.countries.getBases(mapId),
    });
};

export const useGetCountriesTable = (mapId: string, query?: GetCountriesInput) => {
    return useQuery({
        queryKey: [mapId, "countries"],
        queryFn: async () => await window.electron.countries.getTable(mapId, query),
    });
};

export const useAddOffmapPopulation = (mapId: string, id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PopulationInput) =>
            await window.electron.countries.addOffmapPopulation(mapId, id, data),
        onSuccess: () => {
            toast.success("Population added successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "countries", id] });
        },
    });
};

export const useGetPopulation = (mapId: string, id: number) => {
    return useQuery({
        queryKey: [mapId, "countries", id, "population"],
        queryFn: async () => await window.electron.countries.getPopulation(mapId, id),
    });
};
