import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetMaps = () => {
    return useQuery({
        queryFn: async () => await window.electronAPI.getMaps(),
        queryKey: ["maps"],
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
