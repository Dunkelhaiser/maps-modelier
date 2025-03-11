import { useMapStore } from "@store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EthnicityPopulation, Type } from "src/shared/types";

export const useAddPopulation = (mapId: string, provinceId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ethnicitiesPopulation: EthnicityPopulation[]) => {
            await window.electron.provinces.addPopulation(mapId, provinceId, ethnicitiesPopulation);
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
        mutationFn: async ({ provinceIds, type }: { provinceIds: number[]; type: Type }) => {
            await window.electron.provinces.changeType(mapId, provinceIds, type);
            queryClient.invalidateQueries({ queryKey: [mapId, "provinces", "land"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "provinces", "water"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            if (type === "water") queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });

            const updatedSelectedProvinces = selectedProvinces.map((province) =>
                provinceIds.includes(province.id) ? { ...province, type } : province
            );

            const updatedSelectedState = selectedState && { ...selectedState, type };

            useMapStore.setState({ selectedProvinces: updatedSelectedProvinces, selectedState: updatedSelectedState });
        },
    });
};
