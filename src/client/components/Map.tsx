import { Container, Stage } from "@pixi/react";
import { ActiveMap } from "@utils/types";
import "@pixi/unsafe-eval";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProvincesContainer } from "./ProvincesContainer";
import type { FederatedPointerEvent, FederatedWheelEvent } from "@pixi/events";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useMapStore } from "@/store/store";

interface MapRendererProps {
    activeMap: ActiveMap;
}

interface Position {
    x: number;
    y: number;
}

const MIN_SCALE_MULTIPLIER = 1;
const MAX_SCALE_MULTIPLIER = 4;
const ZOOM_SPEED = 0.1;

const MapCanvas = ({ activeMap }: MapRendererProps) => {
    const landProvinces = useMapStore((state) => state.landProvinces);
    const waterProvinces = useMapStore((state) => state.waterProvinces);
    const setLandProvinces = useMapStore((state) => state.setLandProvinces);
    const setWaterProvinces = useMapStore((state) => state.setWaterProvinces);
    const setStates = useMapStore((state) => state.setStates);
    const [mapDimensions, setMapDimensions] = useState<{ width: number; height: number } | null>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [scaleMultiplier, setScaleMultiplier] = useState(1);
    const dragStartRef = useRef<Position>({ x: 0, y: 0 });

    const { width = 0, height: windowHeight = 0 } = useWindowSize();

    const height = windowHeight - 42;

    useEffect(() => {
        const loadData = async () => {
            const [landProvincesArr, waterProvincesArr, states] = await Promise.all([
                window.electronAPI.getAllProvinces(activeMap.id, "land"),
                window.electronAPI.getAllProvinces(activeMap.id, "water"),
                window.electronAPI.getAllStates(activeMap.id),
            ]);

            setLandProvinces(landProvincesArr);
            setWaterProvinces(waterProvincesArr);
            setStates(states);
        };
        loadData();
    }, [activeMap.id, activeMap.imageUrl, setLandProvinces, setStates, setWaterProvinces]);

    useEffect(() => {
        const img = new Image();
        img.src = activeMap.imageUrl;
        img.onload = () => setMapDimensions({ width: img.width, height: img.height });
    }, [activeMap.imageUrl]);

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
        if (!mapDimensions) return;

        const scale = getCurrentScale();

        const x = (width - mapDimensions.width * scale) / 2;
        const y = (height - mapDimensions.height * scale) / 2;

        const constrainedPosition = constrainPosition({ x, y }, scale);

        setPosition(constrainedPosition);
    }, [width, height, mapDimensions, getCurrentScale, constrainPosition]);

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

            const constrainedPosition = constrainPosition(newPosition, getCurrentScale());
            setPosition(constrainedPosition);
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
            const constrainedPosition = constrainPosition(newPosition, getBaseScale() * newScaleMultiplier);
            setPosition(constrainedPosition);
        },
        [constrainPosition, getBaseScale, mapDimensions, position.x, position.y, scaleMultiplier]
    );

    const renderProvinces = useMemo(() => {
        const waterProvincesContainer = (
            <Container sortableChildren>
                {waterProvinces.map((province) => (
                    <ProvincesContainer
                        key={province.id}
                        id={province.id}
                        color={province.color}
                        shape={province.shape}
                        type={province.type}
                    />
                ))}
            </Container>
        );

        const landProvincesContainer = (
            <Container sortableChildren>
                {landProvinces.map((province) => (
                    <ProvincesContainer
                        key={province.id}
                        id={province.id}
                        color={province.color}
                        shape={province.shape}
                        type={province.type}
                    />
                ))}
            </Container>
        );

        return { waterProvincesContainer, landProvincesContainer };
    }, [waterProvinces, landProvinces]);

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
            </Container>
        </Stage>
    );
};

export { MapCanvas };
