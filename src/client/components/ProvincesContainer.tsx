import { Container } from "@pixi/react";
import { Province as ProvinceType } from "@utils/types";
import * as PIXI from "pixi.js";
import { memo } from "react";
import { MemoizedProvince } from "./Province";
import { useMapStore } from "@/store/store";

interface ProvinceContainerProps extends Omit<ProvinceType, "color"> {
    shape: PIXI.Polygon | PIXI.Polygon[];
}

export const ProvincesContainer = memo(
    ({ id, shape, type }: ProvinceContainerProps) => {
        const selectedProvince = useMapStore((state) => state.selectedProvince);
        const setSelectedProvince = useMapStore((state) => state.setSelectedProvince);
        const isSelected = selectedProvince === id;

        return (
            <Container
                eventMode="static"
                pointerdown={() => setSelectedProvince(id)}
                // eslint-disable-next-line no-console
                pointerover={() => console.log(`Hovered over province ${id}`)}
                zIndex={isSelected ? 1 : 0}
            >
                <MemoizedProvince id={id} shape={shape} type={type} isSelected={isSelected} />
            </Container>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.id === nextProps.id && prevProps.type === nextProps.type && prevProps.shape === nextProps.shape
        );
    }
);
ProvincesContainer.displayName = "ProvinceContainer";
