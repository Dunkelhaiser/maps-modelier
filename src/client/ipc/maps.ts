import { CreateMapInput } from "@screens/MapSelection/components/CreateMap/createMapSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetMaps = () => {
    return useQuery({
        queryFn: async () => await window.electron.maps.getAll(),
        queryKey: ["maps"],
    });
};

export const useCreateMap = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateMapInput) => await window.electron.maps.create(data.name, data.provinces),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maps"] });
            toast.success("Map created successfully");
        },
    });
};

export const useRenameMap = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (name: string) => await window.electron.maps.rename(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maps"] });
            toast.success("Map renamed successfully");
        },
    });
};

export const useDeleteMap = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await window.electron.maps.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maps"] });
            toast.success("Map deleted successfully");
        },
    });
};
