import { Container, Stage } from "@pixi/react";
import { extractProvinceShapes } from "@utils/extractProvinceShapes";
import { ActiveMap, Province as ProvinceType } from "@utils/types";
import * as PIXI from "pixi.js";
import "@pixi/unsafe-eval";
import "@pixi/events";
import { useEffect, useState } from "react";
import { Province } from "./Province";

interface MapRendererProps {
    landProvinces: ProvinceType[];
    waterProvinces: ProvinceType[];
    activeMap: ActiveMap;
}

const MapCanvas = ({ landProvinces, waterProvinces, activeMap }: MapRendererProps) => {
    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [landProvincesShapes, setLandProvincesShapes] = useState<Record<number, PIXI.Polygon | PIXI.Polygon[]>>({});
    const [waterProvincesShapes, setWaterProvincesShapes] = useState<Record<number, PIXI.Polygon | PIXI.Polygon[]>>({});

    const handleProvinceClick = (id: number) => {
        setSelectedProvince(id);
        // eslint-disable-next-line no-console
        console.log(`Clicked on province ${id}`);
    };

    const handleProvinceHover = (id: number) => {
        // eslint-disable-next-line no-console
        console.log(`Hovered over province ${id}`);
    };

    useEffect(() => {
        const loadShapes = async () => {
            Promise.all([
                extractProvinceShapes(activeMap.imageUrl, landProvinces),
                extractProvinceShapes(activeMap.imageUrl, waterProvinces),
            ]).then(([landShapes, waterShapes]) => {
                setLandProvincesShapes(landShapes);
                setWaterProvincesShapes(waterShapes);
            });
        };
        loadShapes();
    }, [activeMap.imageUrl, landProvinces, waterProvinces]);

    return (
        <Stage width={800} height={600} options={{ backgroundColor: 0x2d2d2d }}>
            <Container sortableChildren>
                {Object.keys(waterProvincesShapes).length > 0 &&
                    waterProvinces.map((province) => (
                        <Province
                            key={province.id}
                            id={province.id}
                            shape={waterProvincesShapes[province.id]}
                            color={province.color}
                            type={province.type}
                            isSelected={selectedProvince === province.id}
                            onClick={handleProvinceClick}
                            onHover={handleProvinceHover}
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
                            color={province.color}
                            type={province.type}
                            isSelected={selectedProvince === province.id}
                            onClick={handleProvinceClick}
                            onHover={handleProvinceHover}
                        />
                    ))}
            </Container>
        </Stage>
    );
};

export { MapCanvas };
