import { useAppStore } from "@store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetStates = (mapId: string) => {
    return useQuery({
        queryKey: [mapId, "states"],
        queryFn: async () => await window.electronAPI.getAllStates(mapId),
    });
};

export const useCreateState = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name, provinces }: { name: string; provinces?: number[] }) =>
            await window.electronAPI.createState(mapId, name, provinces),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            useAppStore.setState({ selectedState: data });
        },
    });
};

export const useRenameState = (mapId: string, stateId: number) => {
    const queryClient = useQueryClient();
    const selectedState = useAppStore((state) => state.selectedState);

    return useMutation({
        mutationFn: async (name: string) => await window.electronAPI.renameState(mapId, stateId, name),
        onSuccess: ({ name }) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            useAppStore.setState({ selectedState: selectedState && { ...selectedState, name } });
        },
    });
};

export const useDeleteState = (mapId: string, stateId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electronAPI.deleteState(mapId, stateId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });
            useAppStore.setState({ selectedState: null });
        },
    });
};

export const useAddProvinces = (mapId: string) => {
    const queryClient = useQueryClient();
    const selectedState = useAppStore((state) => state.selectedState);

    return useMutation({
        mutationFn: async ({ stateId, provinceIds }: { stateId: number; provinceIds: number[] }) =>
            await window.electronAPI.addProvinces(mapId, stateId, provinceIds),
        onSuccess: (_, { provinceIds }) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            useAppStore.setState({
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
    const selectedState = useAppStore((state) => state.selectedState);

    return useMutation({
        mutationFn: async ({ stateId, provinceIds }: { stateId: number; provinceIds: number[] }) =>
            await window.electronAPI.removeProvinces(mapId, stateId, provinceIds),
        onSuccess: (_, { provinceIds }) => {
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            useAppStore.setState({
                selectedState: selectedState && {
                    ...selectedState,
                    provinces: selectedState.provinces.filter((id) => !provinceIds.includes(id)),
                },
            });
        },
    });
};
