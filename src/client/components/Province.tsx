import { Graphics } from "@pixi/react";
import { Province as ProvinceType } from "@utils/types";
import "@pixi/unsafe-eval";
import "@pixi/events";
import { brightenColor } from "@utils/utils";
import { memo, useCallback } from "react";
import type { Graphics as GraphicsType } from "pixi.js";

interface ProvinceProps extends Omit<ProvinceType, "color"> {
    isSelected: boolean;
}

const Province = ({ id, shape, type, isSelected }: ProvinceProps) => {
    const drawRegion = useCallback(
        (g: GraphicsType, regionShape: number[]) => {
            g.clear();
            const fillColor = type === "land" ? 0x39654a : 0x517478;
            const selectedFillColor = brightenColor(fillColor, 0.4);
            g.beginFill(isSelected ? selectedFillColor : fillColor);
            g.lineStyle({
                width: 0.5,
                color: 0x000000,
                alpha: 0.3,
                alignment: 0.5,
            });
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
