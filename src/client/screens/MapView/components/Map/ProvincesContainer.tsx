import { useActiveMap } from "@hooks/useActiveMap";
import { useAddStates, useGetCountriesStates, useRemoveStates } from "@ipc/countries";
import { useAddProvinces, useGetStateById, useRemoveProvinces } from "@ipc/states";
import { Container } from "@pixi/react";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { FederatedMouseEvent } from "pixi.js";
import { memo, useMemo } from "react";
import { toast } from "sonner";
import { Province as ProvinceType, StateBase } from "src/shared/types";
import { MemoizedProvince } from "./Province";

interface Props {
    province: ProvinceType;
    states: StateBase[];
}

export const ProvincesContainer = memo(
    ({ province, states }: Props) => {
        const { id, shape, type } = province;
        const selectedProvinces = useMapStore((state) => state.selectedProvinces);
        const selectedState = useMapStore((state) => state.selectedState);
        const selectedCountry = useMapStore((state) => state.selectedCountry);
        const selectProvince = useMapStore((state) => state.selectProvince);
        const activeMap = useActiveMap();
        const mode = useMapStore((state) => state.mode);
        const activeSidebar = useSidebarStore((state) => state.activeSidebar);
        const { data: countries } = useGetCountriesStates(activeMap);
        const { data: stateData } = useGetStateById(activeMap, selectedState);
        const addProvinces = useAddProvinces(activeMap);
        const removeProvinces = useRemoveProvinces(activeMap);
        const addStates = useAddStates(activeMap);
        const removeStates = useRemoveStates(activeMap);

        const isSelected = useMemo(
            () => selectedProvinces.some((selectedProvince) => selectedProvince.id === id),
            [selectedProvinces, id]
        );

        const isInSelectedState = useMemo(() => stateData?.provinces.includes(id) ?? false, [stateData, id]);

        const isInSelectedCountry = useMemo(() => {
            if (activeSidebar !== "countries" || !selectedCountry || selectedState || selectedProvinces.length > 0) {
                return false;
            }

            const country = countries?.find((c) => c.id === selectedCountry);
            if (!country) return false;

            const countryStates = states.filter((s) => country.states.includes(s.id));
            return countryStates.some((s) => s.provinces.includes(id));
        }, [activeSidebar, selectedCountry, selectedState, selectedProvinces.length, countries, states, id]);

        const countryColor = useMemo(() => {
            const state = states.find((s) => s.provinces.includes(id));

            if (state) {
                const country = countries?.find((c) => c.states.includes(state.id));
                return country?.color;
            }

            return undefined;
        }, [id, states, countries]);

        const addProvincesToState = async (stateId: number) => {
            const selectedStateType =
                stateData && stateData.provinces.length > 0
                    ? (selectedProvinces.find((p) => stateData.provinces.includes(p.id))?.type ?? type)
                    : null;

            if (selectedStateType && type !== selectedStateType) {
                toast.error(`Cannot add ${type} provinces to a state with ${selectedStateType} provinces`);
                return;
            }

            addProvinces.mutate({ stateId, provinces: [id] });
        };

        const removeProvincesFromState = async (stateId: number) => {
            removeProvinces.mutate({ stateId, provinces: [id] });
            const remainingSelectedProvinces = selectedProvinces.filter((p) => p.id !== id);
            useMapStore.setState({
                selectedProvinces: remainingSelectedProvinces,
                selectedState: remainingSelectedProvinces.length > 0 ? selectedState : null,
            });
        };

        const handleStateEdit = async (state: number) => {
            if (stateData?.provinces.includes(id)) removeProvincesFromState(state);
            else addProvincesToState(state);
        };

        const addStateToCountry = async (countryId: number, stateId: number) => {
            const stateToAdd = states.find((s) => s.id === stateId);

            if (stateToAdd?.type === "water") {
                toast.error("Cannot add water state to a country");
                return;
            }

            addStates.mutate({ countryId, states: [stateId] });
        };

        const removeStateFromCountry = async (countryId: number, stateId: number) => {
            removeStates.mutate({ countryId, states: [stateId] });
            const deselectState = selectedState === stateId;
            if (deselectState)
                useMapStore.setState({ selectedState: null, selectedCountry: null, selectedProvinces: [] });
        };

        const handleCountryEdit = async (countryId: number, stateId: number) => {
            const country = countries?.find((c) => c.id === countryId);
            if (!country) return;

            if (country.states.includes(stateId)) removeStateFromCountry(countryId, stateId);
            else addStateToCountry(countryId, stateId);
        };

        const handleProvinceClick = (event: FederatedMouseEvent) => {
            if (mode === "viewing") {
                selectProvince(province, event.shiftKey, event.button === 2);
                return;
            }

            if (event.altKey && selectedCountry) {
                const affectedState = states.find((s) => s.provinces.includes(id));
                if (affectedState) handleCountryEdit(selectedCountry, affectedState.id);
                return;
            }

            if (event.ctrlKey && selectedState) {
                handleStateEdit(selectedState);
                return;
            }

            selectProvince(province, event.shiftKey, event.button === 2);
        };

        return (
            <Container eventMode="static" pointerdown={handleProvinceClick} zIndex={isSelected ? 1 : 0}>
                <MemoizedProvince
                    id={id}
                    shape={shape}
                    type={type}
                    countryColor={countryColor}
                    isSelected={isSelected}
                    isInSelectedState={isInSelectedState}
                    isInSelectedCountry={isInSelectedCountry}
                />
            </Container>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.province.id === nextProps.province.id &&
            prevProps.province.color === nextProps.province.color &&
            prevProps.province.type === nextProps.province.type &&
            prevProps.province.population === nextProps.province.population &&
            prevProps.province.ethnicities === nextProps.province.ethnicities &&
            prevProps.states === nextProps.states
        );
    }
);
ProvincesContainer.displayName = "ProvinceContainer";
