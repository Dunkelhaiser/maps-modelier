import { useMapStore } from "@store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateStateInput } from "src/shared/schemas/states/createState";
import { StateNameInput } from "src/shared/schemas/states/state";

export const useGetStates = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "states"],
        queryFn: async () => await window.electron.states.getAll(mapId),
    });
};

export const useCreateState = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateStateInput) => await window.electron.states.create(mapId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            useMapStore.setState({ selectedState: data });
        },
    });
};

export const useRenameState = (mapId: string, stateId: number) => {
    const queryClient = useQueryClient();
    const selectedState = useMapStore((state) => state.selectedState);

    return useMutation({
        mutationFn: async (data: StateNameInput) => await window.electron.states.rename(mapId, stateId, data),
        onSuccess: ({ name }) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            useMapStore.setState({ selectedState: selectedState && { ...selectedState, name } });
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
        mutationFn: async ({ stateId, provinceIds }: { stateId: number; provinceIds: number[] }) =>
            await window.electron.states.addProvinces(mapId, stateId, provinceIds),
        onSuccess: (_, { provinceIds }) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            useMapStore.setState({
                selectedState: selectedState && {
                    ...selectedState,
                    provinces: [...new Set([...selectedState.provinces, ...provinceIds])],
                },
            });
        },
    });
};

export const useRemoveProvinces = (mapId: string) => {
    const queryClient = useQueryClient();
    const selectedState = useMapStore((state) => state.selectedState);

    return useMutation({
        mutationFn: async ({ stateId, provinceIds }: { stateId: number; provinceIds: number[] }) =>
            await window.electron.states.removeProvinces(mapId, stateId, provinceIds),
        onSuccess: (_, { provinceIds }) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            useMapStore.setState({
                selectedState: selectedState && {
                    ...selectedState,
                    provinces: selectedState.provinces.filter((id) => !provinceIds.includes(id)),
                },
            });
        },
    });
};
