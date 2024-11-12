import { Container } from "@pixi/react";
import { Province as ProvinceType } from "@utils/types";
import { memo } from "react";
import { MemoizedProvince } from "./Province";
import { useMapStore } from "@/store/store";

export const ProvincesContainer = memo(
    ({ id, shape, color, type }: ProvinceType) => {
        const selectedProvince = useMapStore((state) => state.selectedProvince);
        const setSelectedProvince = useMapStore((state) => state.setSelectedProvince);
        const isSelected = selectedProvince?.id === id;

        return (
            <Container
                eventMode="static"
                pointerdown={() =>
                    setSelectedProvince({
                        id,
                        type,
                        color,
                        shape,
                    })
                }
                zIndex={isSelected ? 1 : 0}
            >
                <MemoizedProvince id={id} shape={shape} type={type} isSelected={isSelected} />
            </Container>
        );
    },
    (prevProps, nextProps) =>
        prevProps.id === nextProps.id && prevProps.type === nextProps.type && prevProps.shape === nextProps.shape
);
ProvincesContainer.displayName = "ProvinceContainer";
