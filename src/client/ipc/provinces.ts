import { useMapSotre } from "@store/store";
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
    const selectedProvinces = useMapSotre((state) => state.selectedProvinces);
    const selectedState = useMapSotre((state) => state.selectedState);

    return useMutation({
        mutationFn: async ({ provinceIds, type }: { provinceIds: number[]; type: "land" | "water" }) => {
            await window.electronAPI.changeProvinceType(mapId, provinceIds, type);
            queryClient.invalidateQueries({ queryKey: [mapId, "provinces", "land"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "provinces", "water"] });
            queryClient.invalidateQueries({ queryKey: [mapId, "states"] });
            if (type === "water") queryClient.invalidateQueries({ queryKey: [mapId, "countries"] });

            const updatedSelectedProvinces = selectedProvinces.map((province) =>
                provinceIds.includes(province.id) ? { ...province, type } : province
            );

            const updatedSelectedState = selectedState && { ...selectedState, type };

            useMapSotre.setState({ selectedProvinces: updatedSelectedProvinces, selectedState: updatedSelectedState });
        },
    });
};
