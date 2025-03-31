import { Graphics } from "@pixi/react";
import "@pixi/unsafe-eval";
import "@pixi/events";
import { brightenColor, darkenColor } from "@utils/utils";
import { memo, useCallback } from "react";
import { Province as ProvinceType } from "src/shared/types";
import type { Graphics as GraphicsType } from "pixi.js";

interface ProvinceProps extends Omit<ProvinceType, "color" | "population" | "ethnicities"> {
    color?: string;
    isSelected: boolean;
    isInSelectedState: boolean;
    isInSelectedCountry: boolean;
    scale: number;
}

const BORDER_THRESHOLD = 2.75;

const Province = ({
    id,
    shape,
    type,
    color,
    isSelected,
    isInSelectedState,
    isInSelectedCountry,
    scale,
}: ProvinceProps) => {
    const drawRegion = useCallback(
        (g: GraphicsType, regionShape: number[]) => {
            g.clear();

            const unassignedFillColor = type === "land" ? 0x39654a : 0x517478;
            const fillColor = color ? parseInt(color.replace("#", "0x"), 16) : unassignedFillColor;

            const lineWidth = scale > BORDER_THRESHOLD ? 0.25 : 0;

            const borderColor = darkenColor(fillColor, isSelected || isInSelectedCountry ? 0.2 : 0.4);

            let finalFillColor = fillColor;
            if (isSelected || isInSelectedCountry) {
                finalFillColor = brightenColor(fillColor, 0.4);
            } else if (isInSelectedState) {
                finalFillColor = brightenColor(fillColor, 0.2);
            }

            let finalBorderColor = borderColor;
            if (isSelected || isInSelectedCountry) {
                finalBorderColor = brightenColor(borderColor, 0.3);
            }

            g.beginFill(finalFillColor);
            g.lineStyle({
                width: lineWidth,
                color: finalBorderColor,
            });
            g.drawPolygon(regionShape);
            g.endFill();
        },
        [type, color, isSelected, isInSelectedState, isInSelectedCountry, scale]
    );

    const shapes = Array.isArray(shape) ? shape : [shape];

    return shapes.map((regionShape) => (
        <Graphics key={`${id}-region-${regionShape.toString()}`} draw={(g) => drawRegion(g, regionShape)} />
    ));
};

export const MemoizedProvince = memo(Province, (prevProps, nextProps) => {
    const prevBorderVisible = prevProps.scale > BORDER_THRESHOLD;
    const nextBorderVisible = nextProps.scale > BORDER_THRESHOLD;

    return (
        prevProps.id === nextProps.id &&
        prevProps.type === nextProps.type &&
        prevProps.shape === nextProps.shape &&
        prevProps.color === nextProps.color &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.isInSelectedState === nextProps.isInSelectedState &&
        prevProps.isInSelectedCountry === nextProps.isInSelectedCountry &&
        prevBorderVisible === nextBorderVisible
    );
});
MemoizedProvince.displayName = "MemoizedProvince";
