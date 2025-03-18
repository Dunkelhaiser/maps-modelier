import { useMapStore } from "@store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateStateInput } from "src/shared/schemas/states/createState";
import { ProvincesAssignmentInput } from "src/shared/schemas/states/provinces";
import { StateNameInput } from "src/shared/schemas/states/state";

export const useGetStates = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "states"],
        queryFn: async () => await window.electron.states.getAll(mapId),
    });
};

export const useGetStateById = (mapId: string, id: number | null) => {
    return useQuery({
        queryKey: [mapId, "states", id],
        queryFn: async () => (id ? await window.electron.states.getById(mapId, id) : null),
        enabled: Boolean(id),
    });
};

export const useCreateState = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateStateInput) => await window.electron.states.create(mapId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            useMapStore.setState({ selectedState: data.id });
        },
    });
};

export const useRenameState = (mapId: string, stateId: number) => {
    const queryClient = useQueryClient();
    const selectedState = useMapStore((state) => state.selectedState);

    return useMutation({
        mutationFn: async (data: StateNameInput) => await window.electron.states.rename(mapId, stateId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "states", selectedState] });
        },
    });
};

export const useDeleteState = (mapId: string, stateId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electron.states.delete(mapId, stateId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
            useMapStore.setState({ selectedState: null });
        },
    });
};

export const useAddProvinces = (mapId: string) => {
    const queryClient = useQueryClient();
    const selectedState = useMapStore((state) => state.selectedState);

    return useMutation({
        mutationFn: async (data: ProvincesAssignmentInput) => await window.electron.states.addProvinces(mapId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "states", selectedState] });
        },
    });
};

export const useRemoveProvinces = (mapId: string) => {
    const queryClient = useQueryClient();
    const selectedState = useMapStore((state) => state.selectedState);

    return useMutation({
        mutationFn: async (data: ProvincesAssignmentInput) => await window.electron.states.removeProvinces(mapId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "states", selectedState] });
        },
    });
};
