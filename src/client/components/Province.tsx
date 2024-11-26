import { Graphics } from "@pixi/react";
import { Province as ProvinceType } from "@utils/types";
import "@pixi/unsafe-eval";
import "@pixi/events";
import { brightenColor, darkenColor } from "@utils/utils";
import { memo, useCallback } from "react";
import type { Graphics as GraphicsType } from "pixi.js";

interface ProvinceProps extends Omit<ProvinceType, "color"> {
    isSelected: boolean;
    isInSelectedState: boolean;
}

const Province = ({ id, shape, type, isSelected, isInSelectedState }: ProvinceProps) => {
    const drawRegion = useCallback(
        (g: GraphicsType, regionShape: number[]) => {
            g.clear();
            const fillColor = type === "land" ? 0x39654a : 0x517478;
            const borderColor = darkenColor(fillColor, isSelected ? 0.2 : 0.4);

            let finalFillColor = fillColor;
            if (isSelected) {
                finalFillColor = brightenColor(fillColor, 0.4);
            } else if (isInSelectedState) {
                finalFillColor = brightenColor(fillColor, 0.2);
            }

            const selectedBorderColor = brightenColor(borderColor, 0.3);

            g.beginFill(finalFillColor);
            g.lineStyle({
                width: 0.5,
                color: isSelected ? selectedBorderColor : borderColor,
            });
            g.drawPolygon(regionShape);
            g.endFill();
        },
        [type, isSelected, isInSelectedState]
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
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.isInSelectedState === nextProps.isInSelectedState
    );
});
MemoizedProvince.displayName = "MemoizedProvince";
