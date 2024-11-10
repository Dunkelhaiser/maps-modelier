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

const MapCanvas = ({ activeMap }: MapRendererProps) => {
    const [landProvinces, setLandProvinces] = useState<ProvinceType[]>([]);
    const [waterProvinces, setWaterProvinces] = useState<ProvinceType[]>([]);
    const [landProvincesShapes, setLandProvincesShapes] = useState<Record<number, PIXI.Polygon | PIXI.Polygon[]>>({});
    const [waterProvincesShapes, setWaterProvincesShapes] = useState<Record<number, PIXI.Polygon | PIXI.Polygon[]>>({});
    const [mapDimensions, setMapDimensions] = useState<{ width: number; height: number } | null>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
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

    const getScale = useCallback(() => {
        if (!mapDimensions) return 1;
        const scaleX = width / mapDimensions.width;
        const scaleY = height / mapDimensions.height;
        return Math.max(scaleX, scaleY);
    }, [width, height, mapDimensions]);

    useEffect(() => {
        if (!mapDimensions) return;

        const scale = getScale();

        const x = (width - mapDimensions.width * scale) / 2;
        const y = (height - mapDimensions.height * scale) / 2;

        setPosition({ x, y });
    }, [width, height, mapDimensions, getScale]);

    const handleDragStart = (event: PIXI.FederatedPointerEvent) => {
        setIsDragging(true);
        dragStartRef.current = { x: event.globalX - position.x, y: event.globalY - position.y };
    };

    const handleDragMove = (event: PIXI.FederatedPointerEvent) => {
        if (!isDragging || !mapDimensions) return;

        const scale = getScale();
        const scaledWidth = mapDimensions.width * scale;
        const scaledHeight = mapDimensions.height * scale;

        const newX = event.globalX - dragStartRef.current.x;
        const newY = event.globalY - dragStartRef.current.y;

        const minX = width - scaledWidth;
        const minY = height - scaledHeight;
        const maxX = 0;
        const maxY = 0;

        const constrainedX = Math.min(maxX, Math.max(minX, newX));
        const constrainedY = Math.min(maxY, Math.max(minY, newY));

        setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    if (!mapDimensions) return null;

    return (
        <Stage width={width} height={height} options={{ backgroundColor: 0x2d2d2d }}>
            <Container
                eventMode="static"
                scale={getScale()}
                x={position.x}
                y={position.y}
                pointerdown={handleDragStart}
                pointermove={handleDragMove}
                pointerup={handleDragEnd}
                pointerupoutside={handleDragEnd}
                cursor={isDragging ? "grabbing" : "grab"}
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
