import { Container } from "@pixi/react";
import { Province as ProvinceType } from "@utils/types";
import { FederatedMouseEvent } from "pixi.js";
import { memo } from "react";
import { MemoizedProvince } from "./Province";
import { useMapStore } from "@/store/store";

export const ProvincesContainer = memo(
    ({ id, shape, color, type }: ProvinceType) => {
        const selectedProvinces = useMapStore((state) => state.selectedProvinces);
        const setSelectedProvince = useMapStore((state) => state.setSelectedProvince);
        const isSelected = selectedProvinces.some((province) => province.id === id);

        const handleProvinceClick = (event: FederatedMouseEvent) => {
            setSelectedProvince(
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
                <MemoizedProvince id={id} shape={shape} type={type} isSelected={isSelected} />
            </Container>
        );
    },
    (prevProps, nextProps) =>
        prevProps.id === nextProps.id && prevProps.type === nextProps.type && prevProps.shape === nextProps.shape
);
ProvincesContainer.displayName = "ProvinceContainer";
