import { Container } from "@pixi/react";
import { Province as ProvinceType } from "@utils/types";
import { FederatedMouseEvent } from "pixi.js";
import { memo, useMemo } from "react";
import { toast } from "sonner";
import { MemoizedProvince } from "./Province";
import { useMapStore } from "@/store/store";

export const ProvincesContainer = memo(
    ({ id, shape, color, type }: ProvinceType) => {
        const selectedProvinces = useMapStore((state) => state.selectedProvinces);
        const setSelectedProvinces = useMapStore((state) => state.setSelectedProvinces);
        const selectedState = useMapStore((state) => state.selectedState);
        const states = useMapStore((state) => state.states);
        const countries = useMapStore((state) => state.countries);

        const isSelected = useMemo(
            () => selectedProvinces.some((province) => province.id === id),
            [selectedProvinces, id]
        );

        const isInSelectedState = useMemo(() => selectedState?.provinces.includes(id) ?? false, [selectedState, id]);

        const countryColor = useMemo(() => {
            const state = states.find((s) => s.provinces.includes(id));

            if (state) {
                const country = countries.find((c) => c.states.includes(state.id));
                return country?.color;
            }

            return undefined;
        }, [id, states, countries]);

        const handleProvinceClick = (event: FederatedMouseEvent) => {
            if (event.shiftKey && selectedState) {
                const existingStateProvinces = selectedState.provinces;
                const selectedStateType =
                    existingStateProvinces.length > 0
                        ? (selectedProvinces.find((p) => existingStateProvinces.includes(p.id))?.type ?? type)
                        : null;

                if (selectedStateType && type !== selectedStateType) {
                    toast.error(`Cannot add ${type} provinces to a state with ${selectedStateType} provinces`);
                    return;
                }
            }

            setSelectedProvinces(
                {
                    id,
                    type,
                    color,
                    shape,
                },
                event.shiftKey
            );
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
    (prevProps, nextProps) =>
        prevProps.id === nextProps.id && prevProps.type === nextProps.type && prevProps.shape === nextProps.shape
);
ProvincesContainer.displayName = "ProvinceContainer";
