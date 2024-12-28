import { useAppStore } from "@store/store";
import { Province } from "./types";

export const selectSingleProvince = (province: Province) => {
    const selectedProvinces = [province];
    useAppStore.setState({ selectedProvinces });
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
