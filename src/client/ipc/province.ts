import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EthnicityPopulation } from "@utils/types";
import { toast } from "sonner";

export const useAddPopulation = (mapId: string, provinceId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ethnicitiesPopulation: EthnicityPopulation[]) => {
            await window.electronAPI.addPopulation(mapId, provinceId, ethnicitiesPopulation);
            queryClient.invalidateQueries({ queryKey: [mapId, "provinces", "land"] });
        },
        onSuccess: () => {
            toast.success("Population added successfully");
        },
    });
};

export const useGetProvinces = (mapId: string, type: "land" | "water") => {
    return useQuery({
        queryKey: [mapId, "provinces", type],
        queryFn: async () => await window.electronAPI.getAllProvinces(mapId, type),
    });
};
