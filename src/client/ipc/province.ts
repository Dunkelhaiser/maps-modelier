import { useMutation } from "@tanstack/react-query";
import { EthnicityPopulation } from "@utils/types";
import { toast } from "sonner";

export const useAddPopulation = (mapId: string, provinceId: number) => {
    return useMutation({
        mutationFn: async (ethnicitiesPopulation: EthnicityPopulation[]) =>
            await window.electronAPI.addPopulation(mapId, provinceId, ethnicitiesPopulation),
        onSuccess: () => {
            toast.success("Population added successfully");
        },
    });
};
