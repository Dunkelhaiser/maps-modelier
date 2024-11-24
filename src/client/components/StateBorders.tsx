import { Graphics } from "@pixi/react";
import { State } from "@utils/types";
import { Graphics as GraphicsType } from "pixi.js";
import { memo, useCallback, useMemo } from "react";
import { useMapStore } from "@/store/store";

interface Props {
    state: State;
}

const StateBorders = ({ state }: Props) => {
    const landProvinces = useMapStore((store) => store.landProvinces);
    const waterProvinces = useMapStore((store) => store.waterProvinces);

    const provinces = useMemo(() => [...landProvinces, ...waterProvinces], [landProvinces, waterProvinces]);

    const drawBorders = useCallback(
        (g: GraphicsType) => {
            g.clear();
            g.lineStyle({
                width: 0.75,
                color: 0x000000,
                alpha: 0.2,
                alignment: 0.5,
            });

            const stateProvinces = provinces.filter((province) => state.provinces.includes(province.id));

            stateProvinces.forEach((province) => {
                const shapes = Array.isArray(province.shape) ? province.shape : [province.shape];

                shapes.forEach((shape) => {
                    for (let i = 0; i < shape.length; i += 2) {
                        const x1 = shape[i];
                        const y1 = shape[i + 1];
                        const x2 = shape[(i + 2) % shape.length];
                        const y2 = shape[(i + 3) % shape.length];

                        const isSharedEdge = stateProvinces.some((otherProvince) => {
                            if (otherProvince.id === province.id) return false;

                            const otherShapes = Array.isArray(otherProvince.shape)
                                ? otherProvince.shape
                                : [otherProvince.shape];

                            return otherShapes.some((otherShape) => {
                                for (let j = 0; j < otherShape.length; j += 2) {
                                    const ox1 = otherShape[j];
                                    const oy1 = otherShape[j + 1];
                                    const ox2 = otherShape[(j + 2) % otherShape.length];
                                    const oy2 = otherShape[(j + 3) % otherShape.length];

                                    if (
                                        (Math.abs(x1 - ox1) < 0.1 &&
                                            Math.abs(y1 - oy1) < 0.1 &&
                                            Math.abs(x2 - ox2) < 0.1 &&
                                            Math.abs(y2 - oy2) < 0.1) ||
                                        (Math.abs(x1 - ox2) < 0.1 &&
                                            Math.abs(y1 - oy2) < 0.1 &&
                                            Math.abs(x2 - ox1) < 0.1 &&
                                            Math.abs(y2 - oy1) < 0.1)
                                    ) {
                                        return true;
                                    }
                                }
                                return false;
                            });
                        });

                        if (!isSharedEdge) {
                            g.moveTo(x1, y1);
                            g.lineTo(x2, y2);
                        }
                    }
                });
            });
        },
        [state, provinces]
    );

    return <Graphics draw={drawBorders} />;
};

export const MemoizedStateBorders = memo(StateBorders, (prevProps, nextProps) => {
    return prevProps.state.id === nextProps.state.id;
});

MemoizedStateBorders.displayName = "MemoizedStateBorders";
