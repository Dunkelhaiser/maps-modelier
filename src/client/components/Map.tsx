import { Container, Stage } from "@pixi/react";
import { extractProvinceShapes } from "@utils/extractProvinceShapes";
import { ActiveMap, Province as ProvinceType } from "@utils/types";
import * as PIXI from "pixi.js";
import "@pixi/unsafe-eval";
import "@pixi/events";
import { useEffect, useState } from "react";
import { Province } from "./Province";

interface MapRendererProps {
    activeMap: ActiveMap;
}

const MapCanvas = ({ activeMap }: MapRendererProps) => {
    const [landProvinces, setLandProvinces] = useState<ProvinceType[]>([]);
    const [waterProvinces, setWaterProvinces] = useState<ProvinceType[]>([]);
    const [landProvincesShapes, setLandProvincesShapes] = useState<Record<number, PIXI.Polygon | PIXI.Polygon[]>>({});
    const [waterProvincesShapes, setWaterProvincesShapes] = useState<Record<number, PIXI.Polygon | PIXI.Polygon[]>>({});

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

    return (
        <Stage width={800} height={600} options={{ backgroundColor: 0x2d2d2d }}>
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
        </Stage>
    );
};

export { MapCanvas };
