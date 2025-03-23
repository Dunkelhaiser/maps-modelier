import { useGetAlliances } from "@ipc/alliances";
import { useGetCountriesStates, useGetCountriesTable } from "@ipc/countries";
import { useGetAllEthnicities } from "@ipc/ethnicities";
import { useGetStates } from "@ipc/states";
import { useGetWars } from "@ipc/wars";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const usePrefetchData = (mapId: string) => {
    const queryClient = useQueryClient();

    const { data: statesArr, isSuccess: isStatesLoaded } = useGetStates(mapId);
    const { data: countriesArr, isSuccess: isCountriesLoaded } = useGetCountriesTable(mapId);
    useGetCountriesStates(mapId);
    useGetAllEthnicities(mapId);
    useGetAlliances(mapId);
    useGetWars(mapId);

    useEffect(() => {
        if (isStatesLoaded && statesArr.length > 0) {
            statesArr.forEach((state) => {
                queryClient.prefetchQuery({
                    queryKey: [mapId, "states", state.id],
                    queryFn: async () => await window.electron.states.getById(mapId, state.id),
                });
            });
        }
    }, [isStatesLoaded, statesArr, mapId, queryClient]);

    useEffect(() => {
        if (isCountriesLoaded && countriesArr.length > 0) {
            countriesArr.forEach((country) => {
                queryClient.prefetchQuery({
                    queryKey: [mapId, "countries", country.id],
                    queryFn: async () => await window.electron.countries.getById(mapId, country.id),
                });
            });
        }
    }, [isCountriesLoaded, countriesArr, mapId, queryClient]);

    return { isLoaded: isCountriesLoaded && isStatesLoaded };
};
