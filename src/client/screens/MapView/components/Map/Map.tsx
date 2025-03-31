import { usePrefetchData } from "@hooks/usePrefetchData";
import { useWindowSize } from "@hooks/useWindowSize";
import { useGetProvinces } from "@ipc/provinces";
import { useGetStates } from "@ipc/states";
import { Container, Stage } from "@pixi/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { updatePopulationRange } from "@utils/populationHeatmap";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@pixi/unsafe-eval";
import { ProvincesContainer } from "./ProvincesContainer";
import { MemoizedStateBorders } from "./StateBorders";
import type { FederatedPointerEvent, FederatedWheelEvent } from "@pixi/events";
import { queryClient } from "@/main";

interface MapRendererProps {
    activeMap: string;
}

interface Position {
    x: number;
    y: number;
}

const MIN_SCALE_MULTIPLIER = 1;
const MAX_SCALE_MULTIPLIER = 4;
const ZOOM_SPEED = 0.3;

const MapCanvas = ({ activeMap }: MapRendererProps) => {
    usePrefetchData(activeMap);
    const landProvinces = useGetProvinces(activeMap, "land");
    const waterProvinces = useGetProvinces(activeMap, "water");
    const states = useGetStates(activeMap);

    const [mapDimensions, setMapDimensions] = useState<{ width: number; height: number } | null>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [scaleMultiplier, setScaleMultiplier] = useState(1);
    const [hasCentered, setHasCentered] = useState(false);

    const dragStartRef = useRef<Position>({ x: 0, y: 0 });

    const { width = 0, height: windowHeight = 0 } = useWindowSize();
    const height = windowHeight - 45.6;

    useEffect(() => {
        if (!landProvinces.data?.length && !waterProvinces.data?.length) return;

        const allProvinces = [...(landProvinces.data ?? []), ...(waterProvinces.data ?? [])];

        if (allProvinces.length === 0) return;

        let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;

        allProvinces.forEach((province) => {
            const shapes = Array.isArray(province.shape) ? province.shape : [province.shape];

            shapes.forEach((shape) => {
                for (let i = 0; i < shape.length; i += 2) {
                    const x = shape[i];
                    const y = shape[i + 1];

                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            });
        });

        setMapDimensions({ width: Math.ceil(maxX - minX), height: Math.ceil(maxY - minY) });
        updatePopulationRange(allProvinces);
    }, [landProvinces.data, waterProvinces.data]);

    const getBaseScale = useCallback(() => {
        if (!mapDimensions) return 1;
        const scaleX = width / mapDimensions.width;
        const scaleY = height / mapDimensions.height;
        return Math.max(scaleX, scaleY);
    }, [width, height, mapDimensions]);

    const getCurrentScale = useCallback(() => {
        return getBaseScale() * scaleMultiplier;
    }, [getBaseScale, scaleMultiplier]);

    const constrainPosition = useCallback(
        (pos: Position, scale: number) => {
            if (!mapDimensions) return pos;

            const scaledWidth = mapDimensions.width * scale;
            const scaledHeight = mapDimensions.height * scale;

            const minX = Math.min(width - scaledWidth, 0);
            const minY = Math.min(height - scaledHeight, 0);
            const maxX = Math.max(0, width - scaledWidth);
            const maxY = Math.max(0, height - scaledHeight);

            return {
                x: Math.min(maxX, Math.max(minX, pos.x)),
                y: Math.min(maxY, Math.max(minY, pos.y)),
            };
        },
        [mapDimensions, width, height]
    );

    useEffect(() => {
        if (!mapDimensions || hasCentered) return;

        const scale = getCurrentScale();

        const x = (width - mapDimensions.width * scale) / 2;
        const y = (height - mapDimensions.height * scale) / 2;

        setPosition(constrainPosition({ x, y }, scale));
        setHasCentered(true);
    }, [width, height, mapDimensions, getCurrentScale, constrainPosition, hasCentered]);

    const handleDragStart = useCallback(
        (event: FederatedPointerEvent) => {
            setIsDragging(true);
            dragStartRef.current = { x: event.globalX - position.x, y: event.globalY - position.y };
        },
        [position.x, position.y]
    );

    const handleDragMove = useCallback(
        (event: FederatedPointerEvent) => {
            if (!isDragging || !mapDimensions) return;

            const newPosition = {
                x: event.globalX - dragStartRef.current.x,
                y: event.globalY - dragStartRef.current.y,
            };

            setPosition(constrainPosition(newPosition, getCurrentScale()));
        },
        [constrainPosition, getCurrentScale, isDragging, mapDimensions]
    );

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleWheel = useCallback(
        (event: FederatedWheelEvent) => {
            if (!mapDimensions) return;

            const mouseX = event.globalX;
            const mouseY = event.globalY;

            const relativeX = mouseX - position.x;
            const relativeY = mouseY - position.y;

            const zoomDelta = -Math.sign(event.deltaY) * ZOOM_SPEED;
            const newScaleMultiplier = Math.max(
                MIN_SCALE_MULTIPLIER,
                Math.min(MAX_SCALE_MULTIPLIER, scaleMultiplier + zoomDelta)
            );

            if (newScaleMultiplier === scaleMultiplier) return;

            const scaleFactor = newScaleMultiplier / scaleMultiplier;

            const newPosition = {
                x: mouseX - relativeX * scaleFactor,
                y: mouseY - relativeY * scaleFactor,
            };

            setScaleMultiplier(newScaleMultiplier);
            setPosition(constrainPosition(newPosition, getBaseScale() * newScaleMultiplier));
        },
        [constrainPosition, getBaseScale, mapDimensions, position.x, position.y, scaleMultiplier]
    );

    const renderProvinces = useMemo(() => {
        const waterProvincesContainer = (
            // ! This is a workaround before the issue is resolved
            <QueryClientProvider client={queryClient}>
                <Container sortableChildren>
                    {waterProvinces.data?.map((province) => (
                        <ProvincesContainer key={province.id} province={province} states={states.data ?? []} />
                    ))}
                </Container>
            </QueryClientProvider>
        );

        const landProvincesContainer = (
            // ! This is a workaround before the issue is resolved
            <QueryClientProvider client={queryClient}>
                <Container sortableChildren>
                    {landProvinces.data?.map((province) => (
                        <ProvincesContainer key={province.id} province={province} states={states.data ?? []} />
                    ))}
                </Container>
            </QueryClientProvider>
        );

        const landStates = states.data?.filter((state) =>
            state.provinces.some((id) => landProvinces.data?.some((p) => p.id === id))
        );
        const waterStates = states.data?.filter((state) =>
            state.provinces.some((id) => waterProvinces.data?.some((p) => p.id === id))
        );

        const waterStateBordersContainer = (
            // ! This is a workaround before the issue is resolved
            <QueryClientProvider client={queryClient}>
                <Container sortableChildren zIndex={2}>
                    {waterStates?.map((state) => (
                        <MemoizedStateBorders key={state.id} state={state} provinces={waterProvinces.data ?? []} />
                    ))}
                </Container>
            </QueryClientProvider>
        );

        const landStateBordersContainer = (
            // ! This is a workaround before the issue is resolved
            <QueryClientProvider client={queryClient}>
                <Container sortableChildren zIndex={2}>
                    {landStates?.map((state) => (
                        <MemoizedStateBorders key={state.id} state={state} provinces={landProvinces.data ?? []} />
                    ))}
                </Container>
            </QueryClientProvider>
        );

        return {
            waterProvincesContainer,
            landProvincesContainer,
            waterStateBordersContainer,
            landStateBordersContainer,
        };
    }, [waterProvinces, landProvinces, states]);

    const transformContainerProps = useMemo(
        () => ({
            scale: getCurrentScale(),
            x: position.x,
            y: position.y,
            eventMode: "static" as const,
            pointerdown: handleDragStart,
            pointermove: handleDragMove,
            pointerup: handleDragEnd,
            pointerupoutside: handleDragEnd,
            onwheel: handleWheel,
            cursor: isDragging ? "grabbing" : "grab",
        }),
        [
            getCurrentScale,
            position.x,
            position.y,
            handleDragStart,
            handleDragMove,
            handleDragEnd,
            handleWheel,
            isDragging,
        ]
    );

    if (!mapDimensions) return null;

    return (
        <Stage width={width} height={height} options={{ backgroundColor: 0x2d2d2d }}>
            <Container {...transformContainerProps}>
                {renderProvinces.waterProvincesContainer}
                {renderProvinces.landProvincesContainer}
                {renderProvinces.waterStateBordersContainer}
                {renderProvinces.landStateBordersContainer}
            </Container>
        </Stage>
    );
};

export { MapCanvas };
