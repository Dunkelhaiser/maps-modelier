import { useAppStore } from "@store/store";
import { Country, Province, State } from "./types";
import { queryClient } from "@/main";

export const selectSingleProvince = (province: Province) => {
    const selectedProvinces = [province];
    const selectedState = findState(province.id);
    if (!selectedState) {
        useAppStore.setState({ selectedProvinces });
        return;
    }

    const selectedCountry = findCountry(selectedState.id);
    useAppStore.setState({ selectedProvinces, selectedState, selectedCountry });
};

export const selectMultipleProvinces = (province: Province) => {
    const { selectedProvinces } = useAppStore.getState();
    const isProvinceSelected = selectedProvinces.some((p) => p.id === province.id);

    if (isProvinceSelected) {
        const afterProvinceDisselection = selectedProvinces.filter((p) => p.id !== province.id);
        useAppStore.setState({ selectedProvinces: afterProvinceDisselection });
    } else {
        useAppStore.setState({ selectedProvinces: [...selectedProvinces, province] });
    }
};

export const selectProvince = (province: Province, isShiftKey: boolean) =>
    isShiftKey ? selectMultipleProvinces(province) : selectSingleProvince(province);

const findState = (provinceId: number) => {
    const { activeMap } = useAppStore.getState();
    const [[, states]] = queryClient.getQueriesData<State[]>({ queryKey: [activeMap?.id, "states"] });
    const selectedState = states?.find((s) => s.provinces.includes(provinceId));
    return selectedState;
};

const findCountry = (stateId: number) => {
    const countries = getCountries();
    const selectedCountry = countries?.find((c) => c.states.includes(stateId));
    return selectedCountry;
};

export const getCountries = () => {
    const { activeMap } = useAppStore.getState();
    const [[, countries]] = queryClient.getQueriesData<Country[]>({ queryKey: [activeMap?.id, "countries"] });
    return countries;
};
