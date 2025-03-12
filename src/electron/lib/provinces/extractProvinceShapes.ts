/* eslint-disable no-bitwise */
import { createCanvas, ImageData, loadImage } from "@napi-rs/canvas";
import { Polygon } from "pixi.js";
import { ProvinceBase } from "../../../shared/types.js";

export const extractProvinceShapes = async (
    _: Electron.IpcMainInvokeEvent,
    imagePath: string,
    provinces: ProvinceBase[]
) => {
    const image = await loadImage(imagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;
    ctx.willReadFrequently = true;
    ctx.drawImage(image, 0, 0);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height) as ImageData;
    const { width, height, data } = imageData;
    const pixelCount = width * height;

    const visited = new Uint8Array(pixelCount);
    const queue = new Int32Array(pixelCount * 2);
    const provinceOutlines: Record<string, Polygon | Polygon[]> = {};

    const colorLookup = new Uint32Array(256 * 256 * 256);
    const provinceColorMap = new Map<number, number>();

    provinces.forEach((province) => {
        const color = parseInt(province.color.replace("#", ""), 16);
        const r = (color >> 16) & 255;
        const g = (color >> 8) & 255;
        const b = color & 255;
        const key = (r << 16) | (g << 8) | b;
        colorLookup[key] = 1;
        provinceColorMap.set(key, province.id);
    });

    const edgeSet = new Set<string>();
    const edgeBuffer: string[] = [];

    const provinceData = new Map<number, { pixels: number[]; count: number }>();

    const rowWidth4 = width * 4;
    for (let y = 0, rowOffset = 0; y < height; y++, rowOffset += rowWidth4) {
        for (let x = 0, pixelOffset = rowOffset; x < width; x++, pixelOffset += 4) {
            const r = data[pixelOffset];
            const g = data[pixelOffset + 1];
            const b = data[pixelOffset + 2];
            const colorKey = (r << 16) | (g << 8) | b;

            if (colorLookup[colorKey]) {
                const provinceId = provinceColorMap.get(colorKey)!;
                let provinceInfo = provinceData.get(provinceId);

                if (!provinceInfo) {
                    provinceInfo = { pixels: [], count: 0 };
                    provinceData.set(provinceId, provinceInfo);
                }

                provinceInfo.pixels.push(x, y);
                provinceInfo.count++;
            }
        }
    }

    const floodFill = (
        startX: number,
        startY: number,
        isProvincePixel: (x: number, y: number) => boolean
    ): Int32Array => {
        const region = new Int32Array(pixelCount * 2);
        let regionSize = 0;
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

            const x1 = x - 1,
                x2 = x + 1,
                y1 = y - 1,
                y2 = y + 1;

            if (isProvincePixel(x1, y) && !visited[y * width + x1]) {
                queue[queueEnd] = x1;
                queue[queueEnd + 1] = y;
                queueEnd += 2;
            }
            if (isProvincePixel(x2, y) && !visited[y * width + x2]) {
                queue[queueEnd] = x2;
                queue[queueEnd + 1] = y;
                queueEnd += 2;
            }
            if (isProvincePixel(x, y1) && !visited[y1 * width + x]) {
                queue[queueEnd] = x;
                queue[queueEnd + 1] = y1;
                queueEnd += 2;
            }
            if (isProvincePixel(x, y2) && !visited[y2 * width + x]) {
                queue[queueEnd] = x;
                queue[queueEnd + 1] = y2;
                queueEnd += 2;
            }
        }

        return region.slice(0, regionSize * 2);
    };

    for (const [provinceId, { pixels, count }] of provinceData) {
        if (count === 0) {
            provinceOutlines[provinceId] = new Polygon([0, 0, 0, 1, 1, 1, 1, 0]);
            continue;
        }

        const targetColor = parseInt(provinces.find((p) => p.id === provinceId)!.color.replace("#", ""), 16);
        const targetR = (targetColor >> 16) & 255;
        const targetG = (targetColor >> 8) & 255;
        const targetB = targetColor & 255;

        const isProvincePixel = (x: number, y: number): boolean => {
            if (x < 0 || y < 0 || x >= width || y >= height) return false;
            const index = (y * width + x) * 4;
            return data[index] === targetR && data[index + 1] === targetG && data[index + 2] === targetB;
        };

        const regions: Int32Array[] = [];
        visited.fill(0);

        // Find all disconnected regions
        for (let i = 0; i < pixels.length; i += 2) {
            const x = pixels[i];
            const y = pixels[i + 1];
            const pixelIndex = y * width + x;

            if (!visited[pixelIndex]) {
                const region = floodFill(x, y, isProvincePixel);
                if (region.length > 0) {
                    regions.push(region);
                }
            }
        }

        const regionPolygons: Polygon[] = [];

        for (const regionPixels of regions) {
            edgeSet.clear();
            edgeBuffer.length = 0;

            for (let i = 0; i < regionPixels.length; i += 2) {
                const x = regionPixels[i];
                const y = regionPixels[i + 1];

                if (!isProvincePixel(x + 1, y)) {
                    const edge = `${x + 1},${y},${x + 1},${y + 1}`;
                    edgeSet.add(edge);
                }
                if (!isProvincePixel(x - 1, y)) {
                    const edge = `${x},${y},${x},${y + 1}`;
                    edgeSet.add(edge);
                }
                if (!isProvincePixel(x, y + 1)) {
                    const edge = `${x},${y + 1},${x + 1},${y + 1}`;
                    edgeSet.add(edge);
                }
                if (!isProvincePixel(x, y - 1)) {
                    const edge = `${x},${y},${x + 1},${y}`;
                    edgeSet.add(edge);
                }
            }

            if (edgeSet.size === 0) {
                const [x, y] = regionPixels;
                regionPolygons.push(new Polygon([x, y, x + 1, y, x + 1, y + 1, x, y + 1]));
                continue;
            }

            // Convert edges to path
            const edges = Array.from(edgeSet).map((edge) => {
                const [x1, y1, x2, y2] = edge.split(",").map(Number);
                return [
                    [x1, y1],
                    [x2, y2],
                ] as [number, number][];
            });

            const pathPoints: [number, number][] = [];
            pathPoints.push(edges[0][0], edges[0][1]);

            const remainingEdges = edges.slice(1);
            const epsilon = 0.01;

            while (remainingEdges.length > 0) {
                const lastPoint = pathPoints[pathPoints.length - 1];
                let foundIndex = -1;

                for (let i = 0; i < remainingEdges.length; i++) {
                    const edge = remainingEdges[i];
                    const [start, end] = edge;

                    if (Math.abs(start[0] - lastPoint[0]) < epsilon && Math.abs(start[1] - lastPoint[1]) < epsilon) {
                        pathPoints.push(end);
                        foundIndex = i;
                        break;
                    }
                    if (Math.abs(end[0] - lastPoint[0]) < epsilon && Math.abs(end[1] - lastPoint[1]) < epsilon) {
                        pathPoints.push(start);
                        foundIndex = i;
                        break;
                    }
                }

                if (foundIndex === -1) break;
                remainingEdges.splice(foundIndex, 1);
            }

            if (pathPoints.length >= 3) {
                regionPolygons.push(new Polygon(pathPoints.flat()));
            }
        }

        provinceOutlines[provinceId] = regionPolygons.length === 1 ? regionPolygons[0] : regionPolygons;
    }

    return provinceOutlines;
};
