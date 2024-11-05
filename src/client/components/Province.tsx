import { Container, Graphics } from "@pixi/react";
import { Province as ProvinceType } from "@utils/types";
import * as PIXI from "pixi.js";
import "@pixi/unsafe-eval";
import "@pixi/events";
import { useCallback } from "react";

interface ProvinceProps extends ProvinceType {
    isSelected: boolean;
    shape: PIXI.Polygon | PIXI.Polygon[];
    onClick: (id: number) => void;
    onHover: (id: number) => void;
}

export const Province = ({ id, shape, type, isSelected, onClick, onHover }: ProvinceProps) => {
    const drawRegion = useCallback(
        (g: PIXI.Graphics, regionShape: PIXI.Polygon) => {
            g.clear();
            const fillColor = type === "land" ? 0x39654a : 0x517478;
            const selectedFillColor = type === "land" ? 0x51916a : 0x5f8e93;
            const borderColor = type === "land" ? 0x283121 : 0x3d575a;
            const selectedBorderColor = type === "land" ? 0x3d4b33 : 0x6f9ca1;
            g.beginFill(isSelected ? selectedFillColor : fillColor);
            g.lineStyle(0.5, isSelected ? selectedBorderColor : borderColor, 1);
            g.drawPolygon(regionShape.points);
            g.endFill();
        },
        [type, isSelected]
    );

    const shapes = Array.isArray(shape) ? shape : [shape];

    return (
        <Container
            interactive
            pointerdown={() => onClick(id)}
            pointerover={() => onHover(id)}
            zIndex={isSelected ? 1 : 0}
        >
            {shapes.map((regionShape) => (
                <Graphics
                    key={`${id}-region-${regionShape.points.toString()}`}
                    draw={(g) => drawRegion(g, regionShape)}
                />
            ))}
        </Container>
    );
};
