import { useActiveMap } from "@hooks/useActiveMap";
import { useAddStates, useGetCountries, useRemoveStates } from "@ipc/countries";
import { useAddProvinces, useRemoveProvinces } from "@ipc/states";
import { Container } from "@pixi/react";
import { useMapStore } from "@store/store";
import { Country, Province as ProvinceType, State } from "@utils/types";
import { FederatedMouseEvent } from "pixi.js";
import { memo, useMemo } from "react";
import { toast } from "sonner";
import { MemoizedProvince } from "./Province";

interface Props {
    province: ProvinceType;
    states: State[];
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
        const { data: countries } = useGetCountries(activeMap.id);
        const addProvinces = useAddProvinces(activeMap.id);
        const removeProvinces = useRemoveProvinces(activeMap.id);
        const addStates = useAddStates(activeMap.id);
        const removeStates = useRemoveStates(activeMap.id);

        const isSelected = useMemo(
            () => selectedProvinces.some((selectedProvince) => selectedProvince.id === id),
            [selectedProvinces, id]
        );

        const isInSelectedState = useMemo(() => selectedState?.provinces.includes(id) ?? false, [selectedState, id]);

        const countryColor = useMemo(() => {
            const state = states.find((s) => s.provinces.includes(id));

            if (state) {
                const country = countries?.find((c) => c.states.includes(state.id));
                return country?.color;
            }

            return undefined;
        }, [id, states, countries]);

        const addProvincesToState = async ({ id: stateId, provinces }: State) => {
            const selectedStateType =
                provinces.length > 0 ? (selectedProvinces.find((p) => provinces.includes(p.id))?.type ?? type) : null;

            if (selectedStateType && type !== selectedStateType) {
                toast.error(`Cannot add ${type} provinces to a state with ${selectedStateType} provinces`);
                return;
            }

            addProvinces.mutate({ stateId, provinceIds: [id] });
        };

        const removeProvincesFromState = async ({ id: stateId }: State) => {
            removeProvinces.mutate({ stateId, provinceIds: [id] });
            const remainingSelectedProvinces = selectedProvinces.filter((p) => p.id !== id);
            useMapStore.setState({
                selectedProvinces: remainingSelectedProvinces,
                selectedState: remainingSelectedProvinces.length > 0 ? selectedState : null,
            });
        };

        const handleStateEdit = async (state: State) => {
            if (state.provinces.includes(id)) removeProvincesFromState(state);
            else addProvincesToState(state);
        };

        const addStateToCountry = async ({ tag }: Country, stateId: number) => {
            const stateToAdd = states.find((s) => s.id === stateId);

            if (stateToAdd?.type === "water") {
                toast.error("Cannot add water state to a country");
                return;
            }

            addStates.mutate({ countryTag: tag, stateIds: [stateId] });
        };

        const removeStateFromCountry = async ({ tag }: Country, stateId: number) => {
            removeStates.mutate({ countryTag: tag, stateIds: [stateId] });
            const deselectState = selectedState?.id === stateId;
            if (deselectState)
                useMapStore.setState({ selectedState: null, selectedCountry: null, selectedProvinces: [] });
        };

        const handleCountryEdit = async (country: Country, stateId: number) => {
            if (country.states.includes(stateId)) removeStateFromCountry(country, stateId);
            else addStateToCountry(country, stateId);
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
