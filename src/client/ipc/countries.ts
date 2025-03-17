import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { CreateCountryInput } from "src/shared/schemas/countries/createCountry";
import { StatesAssignmentInput } from "src/shared/schemas/countries/states";
import { UpdateCountryInput } from "src/shared/schemas/countries/updateCountry";

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

    return useMutation({
        mutationFn: async (data: UpdateCountryInput) => await window.electron.countries.update(mapId, tag, data),
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

export const useGetCountriesStates = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "countries_states"],
        queryFn: async () => await window.electron.countries.getStates(mapId),
    });
};

export const useGetCountryByTag = (mapId: string, tag: string | null) => {
    return useQuery({
        queryKey: [mapId, "countries", tag],
        queryFn: async () => (tag ? await window.electron.countries.getByTag(mapId, tag) : null),
        enabled: Boolean(tag),
    });
};

export const useGetCountriesBase = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "countries_base"],
        queryFn: async () => await window.electron.countries.getBases(mapId),
    });
};

export const useGetCountriesTable = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "countries"],
        queryFn: async () => await window.electron.countries.getTable(mapId),
    });
};

export const usePrefetchCountries = (mapId: string) => {
    const queryClient = useQueryClient();

    const { data: countriesTable, isSuccess: isTableLoaded } = useGetCountriesTable(mapId);

    useEffect(() => {
        if (isTableLoaded && countriesTable.length > 0) {
            countriesTable.forEach((country) => {
                queryClient.prefetchQuery({
                    queryKey: [mapId, "countries", country.tag],
                    queryFn: async () => await window.electron.countries.getByTag(mapId, country.tag),
                });
            });
        }
    }, [isTableLoaded, countriesTable, mapId, queryClient]);

    return { isLoaded: isTableLoaded };
};
