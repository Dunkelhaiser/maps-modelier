/* eslint-disable no-bitwise */
/* eslint-disable import/namespace */
import { Province as ProvinceType } from "@utils/types";
import * as PIXI from "pixi.js";

export const extractProvinceShapes = async (imagePath: string, provinces: ProvinceType[]) => {
    const image = new Image();
    image.src = imagePath;

    await new Promise((resolve) => void (image.onload = resolve));

    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas context not available");

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { width, height, data } = imageData;
    const provinceOutlines: Record<string, PIXI.Polygon | PIXI.Polygon[]> = {};

    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];

    const visited = new Uint8Array(width * height);

    provinces.forEach((province) => {
        const colorHex = province.color.replace("#", "");
        const targetColor = parseInt(colorHex, 16);
        const targetR = (targetColor >> 16) & 255;
        const targetG = (targetColor >> 8) & 255;
        const targetB = targetColor & 255;

        const isProvincePixel = (x: number, y: number) => {
            if (x < 0 || y < 0 || x >= width || y >= height) return false;
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            return r === targetR && g === targetG && b === targetB;
        };

        const provincePixels = new Int32Array(width * height * 2);
        let pixelCount = 0;

        // Find province pixels
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (isProvincePixel(x, y)) {
                    provincePixels[pixelCount * 2] = x;
                    provincePixels[pixelCount * 2 + 1] = y;
                    pixelCount++;
                }
            }
        }

        // Handle empty or single-pixel provinces
        if (pixelCount === 0) {
            provinceOutlines[province.id] = new PIXI.Polygon([0, 0, 0, 1, 1, 1, 1, 0]);
            return;
        }

        const regions: Int32Array[] = [];
        visited.fill(0);

        const floodFill = (startX: number, startY: number): Int32Array => {
            const region = new Int32Array(width * height * 2);
            let regionSize = 0;
            const queue = new Int32Array(width * height * 2);
            let queueStart = 0;
            let queueEnd = 2;

            queue[0] = startX;
            queue[1] = startY;

            while (queueStart < queueEnd) {
                const x = queue[queueStart];
                const y = queue[queueStart + 1];
                queueStart += 2;

                const pixelIndex = y * width + x;
                if (visited[pixelIndex]) continue;

                visited[pixelIndex] = 1;
                region[regionSize * 2] = x;
                region[regionSize * 2 + 1] = y;
                regionSize++;

                for (const [dx, dy] of directions) {
                    const newX = x + dx;
                    const newY = y + dy;
                    const newIndex = newY * width + newX;

                    if (isProvincePixel(newX, newY) && !visited[newIndex]) {
                        queue[queueEnd] = newX;
                        queue[queueEnd + 1] = newY;
                        queueEnd += 2;
                    }
                }
            }

            return region.slice(0, regionSize * 2);
        };

        // Find all disconnected regions
        for (let i = 0; i < pixelCount * 2; i += 2) {
            const x = provincePixels[i];
            const y = provincePixels[i + 1];
            const pixelIndex = y * width + x;

            if (!visited[pixelIndex]) {
                const region = floodFill(x, y);
                if (region.length > 0) {
                    regions.push(region);
                }
            }
        }

        const regionPolygons: PIXI.Polygon[] = [];
        const edgeSet = new Set<string>();

        regions.forEach((regionPixels) => {
            edgeSet.clear();

            const addEdge = (x1: number, y1: number, x2: number, y2: number) => {
                const edge = `${Math.min(x1, x2)},${Math.min(y1, y2)},${Math.max(x1, x2)},${Math.max(y1, y2)}`;
                edgeSet.add(edge);
            };

            // Find edges for each pixel
            for (let i = 0; i < regionPixels.length; i += 2) {
                const x = regionPixels[i];
                const y = regionPixels[i + 1];

                if (!isProvincePixel(x + 1, y)) addEdge(x + 1, y, x + 1, y + 1);
                if (!isProvincePixel(x - 1, y)) addEdge(x, y, x, y + 1);
                if (!isProvincePixel(x, y + 1)) addEdge(x, y + 1, x + 1, y + 1);
                if (!isProvincePixel(x, y - 1)) addEdge(x, y, x + 1, y);
            }

            // Convert edges to a continuous path
            const edges = Array.from(edgeSet).map((edge) => {
                const [x1, y1, x2, y2] = edge.split(",").map(Number);
                return [
                    [x1, y1],
                    [x2, y2],
                ] as [number, number][];
            });

            if (edges.length === 0) {
                const [x] = regionPixels;
                const [, y] = regionPixels;
                regionPolygons.push(new PIXI.Polygon([x, y, x + 1, y, x + 1, y + 1, x, y + 1]));
                return;
            }

            // Sort edges into a continuous path
            const pathPoints: [number, number][] = [];
            pathPoints.push(edges[0][0], edges[0][1]);

            const remainingEdges = edges.slice(1);
            const epsilon = 0.01;

            while (remainingEdges.length > 0) {
                const lastPoint = pathPoints[pathPoints.length - 1];
                let found = false;

                for (let i = 0; i < remainingEdges.length; i++) {
                    const edge = remainingEdges[i];
                    const matchStart =
                        Math.abs(edge[0][0] - lastPoint[0]) < epsilon && Math.abs(edge[0][1] - lastPoint[1]) < epsilon;
                    const matchEnd =
                        Math.abs(edge[1][0] - lastPoint[0]) < epsilon && Math.abs(edge[1][1] - lastPoint[1]) < epsilon;

                    if (matchStart || matchEnd) {
                        pathPoints.push(matchStart ? edge[1] : edge[0]);
                        remainingEdges.splice(i, 1);
                        found = true;
                        break;
                    }
                }

                if (!found) break;
            }

            if (pathPoints.length >= 3) {
                regionPolygons.push(new PIXI.Polygon(pathPoints.flat()));
            }
        });

        provinceOutlines[province.id] = regionPolygons.length === 1 ? regionPolygons[0] : regionPolygons;
    });

    return provinceOutlines;
};
