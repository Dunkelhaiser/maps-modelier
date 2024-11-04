/* eslint-disable import/namespace */
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
            g.beginFill(isSelected ? 0x51916a : fillColor);
            g.lineStyle(0.5, isSelected ? 0x3d4b33 : 0x283121, 1);
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

export const extractProvinceShapes = async (imagePath: string, provinces: ProvinceType[]) => {
    const image = new Image();
    image.src = imagePath;

    await new Promise((resolve) => void (image.onload = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const provinceOutlines: Record<string, PIXI.Polygon | PIXI.Polygon[]> = {};

    provinces.forEach((province) => {
        const colorHex = province.color.replace("#", "");

        const isProvincePixel = (x: number, y: number) => {
            if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return false;
            const index = (y * canvas.width + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            // eslint-disable-next-line no-bitwise
            const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
            return hex === colorHex;
        };

        // Find province pixels
        const provincePixels: [number, number][] = [];
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                if (isProvincePixel(x, y)) {
                    provincePixels.push([x, y]);
                }
            }
        }

        // Handle empty or single-pixel provinces
        if (provincePixels.length === 0) {
            provinceOutlines[province.id] = new PIXI.Polygon([0, 0, 0, 1, 1, 1, 1, 0]);
            return;
        }

        // Find disconnected regions
        const regions: [number, number][][] = [];
        const regionVisited = new Set<string>();

        const floodFill = (startX: number, startY: number): [number, number][] => {
            const region: [number, number][] = [];
            const queue: [number, number][] = [[startX, startY]];

            while (queue.length > 0) {
                const [x, y] = queue.shift()!;
                const key = `${x},${y}`;

                if (regionVisited.has(key)) continue;

                regionVisited.add(key);
                region.push([x, y]);

                // Check 4-connected neighbors
                const neighbors = [
                    [x + 1, y],
                    [x - 1, y],
                    [x, y + 1],
                    [x, y - 1],
                ];

                for (const [newX, newY] of neighbors) {
                    const newKey = `${newX},${newY}`;
                    if (isProvincePixel(newX, newY) && !regionVisited.has(newKey)) {
                        queue.push([newX, newY]);
                    }
                }
            }

            return region;
        };

        // Find all disconnected regions
        for (const [x, y] of provincePixels) {
            const key = `${x},${y}`;
            if (!regionVisited.has(key)) {
                const region = floodFill(x, y);
                if (region.length > 0) {
                    regions.push(region);
                }
            }
        }

        // Process each region
        const regionPolygons: PIXI.Polygon[] = [];

        regions.forEach((regionPixels) => {
            // Create a grid to track edges
            const edgeMap = new Map<string, boolean>();

            // Helper to add edge to the map
            const addEdge = (x1: number, y1: number, x2: number, y2: number) => {
                const edge = `${Math.min(x1, x2)},${Math.min(y1, y2)},${Math.max(x1, x2)},${Math.max(y1, y2)}`;
                edgeMap.set(edge, true);
            };

            // Find edges for each pixel
            regionPixels.forEach(([x, y]) => {
                // Check each side of the pixel
                if (!isProvincePixel(x + 1, y)) addEdge(x + 1, y, x + 1, y + 1);
                if (!isProvincePixel(x - 1, y)) addEdge(x, y, x, y + 1);
                if (!isProvincePixel(x, y + 1)) addEdge(x, y + 1, x + 1, y + 1);
                if (!isProvincePixel(x, y - 1)) addEdge(x, y, x + 1, y);
            });

            // Convert edges to a continuous path
            const edges = Array.from(edgeMap.keys()).map((edge) => {
                const [x1, y1, x2, y2] = edge.split(",").map(Number);
                return [
                    [x1, y1],
                    [x2, y2],
                ];
            }) satisfies [number, number][][];

            if (edges.length === 0) {
                // Handle single pixel case
                const [[x, y]] = regionPixels;
                regionPolygons.push(new PIXI.Polygon([x, y, x + 1, y, x + 1, y + 1, x, y + 1]));
                return;
            }

            // Sort edges into a continuous path
            const pathPoints: [number, number][] = [];
            const [currentEdge] = edges;
            const remainingEdges = edges.slice(1);
            pathPoints.push(currentEdge[0], currentEdge[1]);

            while (remainingEdges.length > 0) {
                const lastPoint = pathPoints[pathPoints.length - 1];
                const nextEdgeIndex = remainingEdges.findIndex(
                    (edge) =>
                        (Math.abs(edge[0][0] - lastPoint[0]) < 0.01 && Math.abs(edge[0][1] - lastPoint[1]) < 0.01) ||
                        (Math.abs(edge[1][0] - lastPoint[0]) < 0.01 && Math.abs(edge[1][1] - lastPoint[1]) < 0.01)
                );

                if (nextEdgeIndex === -1) break;

                const nextEdge = remainingEdges[nextEdgeIndex];
                const nextPoint =
                    Math.abs(nextEdge[0][0] - lastPoint[0]) < 0.01 && Math.abs(nextEdge[0][1] - lastPoint[1]) < 0.01
                        ? nextEdge[1]
                        : nextEdge[0];

                pathPoints.push(nextPoint);
                remainingEdges.splice(nextEdgeIndex, 1);
            }

            // Create polygon from path points
            if (pathPoints.length >= 3) {
                regionPolygons.push(new PIXI.Polygon(pathPoints.flat()));
            }
        });

        // Store results
        provinceOutlines[province.id] = regionPolygons.length === 1 ? regionPolygons[0] : regionPolygons;
    });

    return provinceOutlines;
};
