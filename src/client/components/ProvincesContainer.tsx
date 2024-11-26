import { Container } from "@pixi/react";
import { Province as ProvinceType } from "@utils/types";
import { FederatedMouseEvent } from "pixi.js";
import { memo, useMemo } from "react";
import { MemoizedProvince } from "./Province";
import { useMapStore } from "@/store/store";

export const ProvincesContainer = memo(
    ({ id, shape, color, type }: ProvinceType) => {
        const selectedProvinces = useMapStore((state) => state.selectedProvinces);
        const setSelectedProvinces = useMapStore((state) => state.setSelectedProvinces);
        const selectedState = useMapStore((state) => state.selectedState);

        const isSelected = useMemo(
            () => selectedProvinces.some((province) => province.id === id),
            [selectedProvinces, id]
        );

        const isInSelectedState = useMemo(() => selectedState?.provinces.includes(id) ?? false, [selectedState, id]);

        const handleProvinceClick = (event: FederatedMouseEvent) => {
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
