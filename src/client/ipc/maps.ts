import { CreateMapInput } from "@screens/MapSelection/components/CreateMap/createMapSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetMaps = () => {
    return useQuery({
        queryFn: async () => await window.electronAPI.getMaps(),
        queryKey: ["maps"],
    });
};

export const useCreateMap = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateMapInput) => await window.electronAPI.createMap(data.name, data.provinces),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maps"] });
            toast.success("Map created successfully");
        },
    });
};

export const useRenameMap = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (name: string) => await window.electronAPI.renameMap(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maps"] });
            toast.success("Map renamed successfully");
        },
    });
};

export const useDeleteMap = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electronAPI.deleteMap(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maps"] });
            toast.success("Map deleted successfully");
        },
    });
};
