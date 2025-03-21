import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountriesStates } from "@ipc/countries";
import { Container, Graphics } from "@pixi/react";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { brightenColor, darkenColor } from "@utils/utils";
import { Graphics as GraphicsType } from "pixi.js";
import { memo, useCallback, useMemo } from "react";
import { Province, StateBase } from "src/shared/types";

interface Props {
    state: StateBase;
    provinces: Province[];
}

const StateBorders = ({ state, provinces }: Props) => {
    const selectedState = useMapStore((store) => store.selectedState);
    const selectedCountry = useMapStore((store) => store.selectedCountry);
    const selectedProvinces = useMapStore((store) => store.selectedProvinces);
    const activeSidebar = useSidebarStore((store) => store.activeSidebar);
    const activeMap = useActiveMap();
    const { data: countries } = useGetCountriesStates(activeMap);

    const isSelected = selectedState === state.id;

    const isInSelectedCountry = useMemo(() => {
        if (activeSidebar !== "countries" || !selectedCountry || selectedState || selectedProvinces.length > 0) {
            return false;
        }

        const country = countries?.find((c) => c.id === selectedCountry);
        return country?.states.includes(state.id) ?? false;
    }, [activeSidebar, selectedCountry, selectedState, selectedProvinces, state.id, countries]);

    const countryColor = useMemo(() => {
        const country = countries?.find((c) => c.states.includes(state.id));
        return country?.color;
    }, [countries, state.id]);

    const drawBorders = useCallback(
        (g: GraphicsType) => {
            g.clear();
            const stateProvinces = provinces.filter((province) => state.provinces.includes(province.id));

            stateProvinces.forEach((province) => {
                const shapes = Array.isArray(province.shape) ? province.shape : [province.shape];

                const unassignedFillColor = province.type === "land" ? 0x39654a : 0x517478;
                const fillColor = countryColor ? parseInt(countryColor.replace("#", "0x"), 16) : unassignedFillColor;

                let borderColor;
                if (isSelected) {
                    borderColor = brightenColor(fillColor, 1);
                } else if (isInSelectedCountry) {
                    borderColor = brightenColor(darkenColor(fillColor, 0.2), 0.4);
                } else {
                    borderColor = darkenColor(fillColor, 0.5);
                }

                g.lineStyle({
                    width: 0.5,
                    color: borderColor,
                });

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
        [provinces, state.provinces, isSelected, countryColor, isInSelectedCountry]
    );

    // eslint-disable-next-line no-nested-ternary
    const zIndex = isSelected ? 3 : isInSelectedCountry ? 2 : 1;

    return (
        <Container eventMode="static" zIndex={zIndex}>
            <Graphics draw={drawBorders} />
        </Container>
    );
};

export const MemoizedStateBorders = memo(StateBorders, (prevProps, nextProps) => {
    return (
        prevProps.state.id === nextProps.state.id &&
        prevProps.state.provinces.length === nextProps.state.provinces.length &&
        prevProps.state.provinces.every((id) => nextProps.state.provinces.includes(id))
    );
});
MemoizedStateBorders.displayName = "MemoizedStateBorders";
