import { Graphics } from "@pixi/react";
import { Province as ProvinceType } from "@utils/types";
import * as PIXI from "pixi.js";
import "@pixi/unsafe-eval";
import "@pixi/events";
import { memo, useCallback } from "react";

interface ProvinceProps extends Omit<ProvinceType, "color"> {
    isSelected: boolean;
}

const Province = ({ id, shape, type, isSelected }: ProvinceProps) => {
    const drawRegion = useCallback(
        (g: PIXI.Graphics, regionShape: number[]) => {
            g.clear();
            const fillColor = type === "land" ? 0x39654a : 0x517478;
            const selectedFillColor = type === "land" ? 0x51916a : 0x5f8e93;
            const borderColor = type === "land" ? 0x283121 : 0x3d575a;
            const selectedBorderColor = type === "land" ? 0x3d4b33 : 0x6f9ca1;
            g.beginFill(isSelected ? selectedFillColor : fillColor);
            g.lineStyle(0.5, isSelected ? selectedBorderColor : borderColor, 1);
            g.drawPolygon(regionShape);
            g.endFill();
        },
        [type, isSelected]
    );

    const shapes = Array.isArray(shape) ? shape : [shape];

    return shapes.map((regionShape) => (
        <Graphics key={`${id}-region-${regionShape.toString()}`} draw={(g) => drawRegion(g, regionShape)} />
    ));
};

export const MemoizedProvince = memo(Province, (prevProps, nextProps) => {
    return (
        prevProps.id === nextProps.id &&
        prevProps.type === nextProps.type &&
        prevProps.shape === nextProps.shape &&
        prevProps.isSelected === nextProps.isSelected
    );
});
MemoizedProvince.displayName = "MemoizedProvince";
