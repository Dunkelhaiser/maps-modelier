import { useAppStore } from "@store/store";
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

export const useChangeProvinceType = (mapId: string) => {
    const queryClient = useQueryClient();
    const selectedProvinces = useAppStore((state) => state.selectedProvinces);
    const selectedState = useAppStore((state) => state.selectedState);

    return useMutation({
        mutationFn: async (data: { provinceIds: number[]; type: "land" | "water" }) => {
            await window.electronAPI.changeProvinceType(mapId, data.provinceIds, data.type);
            queryClient.invalidateQueries({ queryKey: [mapId, "provinces", "land"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "provinces", "water"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            if (data.type === "water") queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });

            const updatedSelectedProvinces = selectedProvinces.map((province) =>
                data.provinceIds.includes(province.id) ? { ...province, type: data.type } : province
            );

            const updatedSelectedState = selectedState && { ...selectedState, type: data.type };

            useAppStore.setState({ selectedProvinces: updatedSelectedProvinces, selectedState: updatedSelectedState });
        },
    });
};
