import { Container, Stage } from "@pixi/react";
import { ActiveMap, Province as ProvinceType } from "@utils/types";
import * as PIXI from "pixi.js";
import "@pixi/unsafe-eval";
import "@pixi/events";
import { useEffect, useState } from "react";
import { extractProvinceShapes, Province } from "./Province";

interface MapRendererProps {
    provinces: ProvinceType[];
    activeMap: ActiveMap;
}

const MapCanvas = ({ provinces, activeMap }: MapRendererProps) => {
    const [provinceShapes, setProvinceShapes] = useState<Record<string, PIXI.Polygon | PIXI.Polygon[]>>({});
    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);

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
            const shapes = await extractProvinceShapes(activeMap.imageUrl, provinces);
            setProvinceShapes(shapes);
        };
        loadShapes();
    }, [activeMap.imageUrl, provinces]);

    return (
        <Stage width={800} height={600} options={{ backgroundColor: 0x2d2d2d }}>
            <Container sortableChildren>
                {Object.keys(provinceShapes).length > 0 &&
                    provinces.map((province) => (
                        <Province
                            key={province.id}
                            id={province.id}
                            shape={provinceShapes[province.id]}
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
