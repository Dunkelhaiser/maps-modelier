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
