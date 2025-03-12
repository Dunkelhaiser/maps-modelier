import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateAllianceInput } from "src/shared/schemas/alliances/createAlliance";

export const useCreateAlliance = (mapId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateAllianceInput) => await window.electron.alliances.create(mapId, data),
        onSuccess: () => {
            toast.success("Alliance created successfully");
            queryClient.invalidateQueries({ queryKey: [mapId, "alliances"] });
        },
    });
};
