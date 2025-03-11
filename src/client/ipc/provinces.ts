import { useMapStore } from "@store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChangeTypeInput } from "src/shared/schemas/provinces/changeType";
import { PopulationInput } from "src/shared/schemas/provinces/population";
import { Type } from "src/shared/types";

export const useAddPopulation = (mapId: string, provinceId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PopulationInput) => {
            await window.electron.provinces.addPopulation(mapId, provinceId, data);
            queryClient.invalidateQueries({ queryKey: [mapId, "provinces", "land"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
        },
        onSuccess: () => {
            toast.success("Population added successfully");
        },
    });
};

export const useGetProvinces = (mapId: string, type: Type) => {
    return useQuery({
        queryKey: [mapId, "provinces", type],
        queryFn: async () => await window.electron.provinces.getAll(mapId, type),
    });
};

export const useChangeProvinceType = (mapId: string) => {
    const queryClient = useQueryClient();
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const selectedState = useMapStore((state) => state.selectedState);

    return useMutation({
        mutationFn: async (data: ChangeTypeInput) => {
            await window.electron.provinces.changeType(mapId, data);
            queryClient.invalidateQueries({ queryKey: [mapId, "provinces", "land"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "provinces", "water"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            const { provinceIds, type } = data;
            if (type === "water") queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });

            const updatedSelectedProvinces = selectedProvinces.map((province) =>
                provinceIds.includes(province.id) ? { ...province, type } : province
            );

            const updatedSelectedState = selectedState && { ...selectedState, type };

            useMapStore.setState({ selectedProvinces: updatedSelectedProvinces, selectedState: updatedSelectedState });
        },
    });
};
