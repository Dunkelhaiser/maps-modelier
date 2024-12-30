import { useAddProvinces } from "@ipc/states";
import { Container } from "@pixi/react";
import { useAppStore } from "@store/store";
import { getCountries, selectProvince } from "@utils/mapFuncs";
import { Province as ProvinceType, State } from "@utils/types";
import { FederatedMouseEvent } from "pixi.js";
import { memo, useMemo } from "react";
import { toast } from "sonner";
import { MemoizedProvince } from "./Province";

interface Props {
    province: ProvinceType;
    states: State[];
}

export const ProvincesContainer = memo(
    ({ province: { id, shape, color, type, ethnicities, population }, states }: Props) => {
        const selectedProvinces = useAppStore((state) => state.selectedProvinces);
        const selectedState = useAppStore((state) => state.selectedState);
        const activeMap = useAppStore((state) => state.activeMap)!;
        const mode = useAppStore((state) => state.mode);
        const countries = getCountries();
        const addProvinces = useAddProvinces(activeMap.id);

        const isSelected = useMemo(
            () => selectedProvinces.some((province) => province.id === id),
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

        const handleProvinceClick = (event: FederatedMouseEvent) =>
            mode === "states_editing" && selectedState && event.shiftKey
                ? addProvincesToState(selectedState)
                : selectProvince(
                      {
                          id,
                          type,
                          color,
                          shape,
                          ethnicities,
                          population,
                      },
                      event.shiftKey
                  );

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
    (prevProps, nextProps) => prevProps.province === nextProps.province
);
ProvincesContainer.displayName = "ProvinceContainer";
