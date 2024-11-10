import { Container, Stage } from "@pixi/react";
import { extractProvinceShapes } from "@utils/extractProvinceShapes";
import { ActiveMap, Province as ProvinceType } from "@utils/types";
import * as PIXI from "pixi.js";
import "@pixi/unsafe-eval";
import "@pixi/events";
import { useCallback, useEffect, useRef, useState } from "react";
import { Province } from "./Province";
import { useWindowSize } from "@/hooks/useWindowSize";

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
    const [landProvinces, setLandProvinces] = useState<ProvinceType[]>([]);
    const [waterProvinces, setWaterProvinces] = useState<ProvinceType[]>([]);
    const [landProvincesShapes, setLandProvincesShapes] = useState<Record<number, PIXI.Polygon | PIXI.Polygon[]>>({});
    const [waterProvincesShapes, setWaterProvincesShapes] = useState<Record<number, PIXI.Polygon | PIXI.Polygon[]>>({});
    const [mapDimensions, setMapDimensions] = useState<{ width: number; height: number } | null>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [scaleMultiplier, setScaleMultiplier] = useState(1);
    const dragStartRef = useRef<Position>({ x: 0, y: 0 });

    const { width = 0, height = 0 } = useWindowSize();

    useEffect(() => {
        const loadShapes = async () => {
            const startTime = performance.now();

            const [landProvincesArr, waterProvincesArr] = await Promise.all([
                window.electronAPI.getAllProvinces(activeMap.id, "land"),
                window.electronAPI.getAllProvinces(activeMap.id, "water"),
            ]);

            setLandProvinces(landProvincesArr);
            setWaterProvinces(waterProvincesArr);

            const [landShapes, waterShapes] = await Promise.all([
                extractProvinceShapes(activeMap.imageUrl, landProvincesArr),
                extractProvinceShapes(activeMap.imageUrl, waterProvincesArr),
            ]);

            setLandProvincesShapes(landShapes);
            setWaterProvincesShapes(waterShapes);

            const endTime = performance.now();
            // eslint-disable-next-line no-console
            console.log(`Shapes loaded in ${endTime - startTime}ms`);
        };
        loadShapes();
    }, [activeMap.id, activeMap.imageUrl]);

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

    const handleDragStart = (event: PIXI.FederatedPointerEvent) => {
        setIsDragging(true);
        dragStartRef.current = { x: event.globalX - position.x, y: event.globalY - position.y };
    };

    const handleDragMove = (event: PIXI.FederatedPointerEvent) => {
        if (!isDragging || !mapDimensions) return;

        const newPosition = {
            x: event.globalX - dragStartRef.current.x,
            y: event.globalY - dragStartRef.current.y,
        };

        const constrainedPosition = constrainPosition(newPosition, getCurrentScale());
        setPosition(constrainedPosition);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleWheel = (event: PIXI.FederatedWheelEvent) => {
        if (!mapDimensions) return;

        // Calculate zoom center (mouse position)
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
    };

    if (!mapDimensions) return null;

    return (
        <Stage width={width} height={height} options={{ backgroundColor: 0x2d2d2d }}>
            <Container
                eventMode="static"
                scale={getCurrentScale()}
                x={position.x}
                y={position.y}
                pointerdown={handleDragStart}
                pointermove={handleDragMove}
                pointerup={handleDragEnd}
                pointerupoutside={handleDragEnd}
                cursor={isDragging ? "grabbing" : "grab"}
                onwheel={handleWheel}
            >
                <Container sortableChildren>
                    {Object.keys(waterProvincesShapes).length > 0 &&
                        waterProvinces.map((province) => (
                            <Province
                                key={province.id}
                                id={province.id}
                                shape={waterProvincesShapes[province.id]}
                                type={province.type}
                            />
                        ))}
                </Container>
                <Container sortableChildren>
                    {Object.keys(landProvincesShapes).length > 0 &&
                        landProvinces.map((province) => (
                            <Province
                                key={province.id}
                                id={province.id}
                                shape={landProvincesShapes[province.id]}
                                type={province.type}
                            />
                        ))}
                </Container>
            </Container>
        </Stage>
    );
};

export { MapCanvas };
