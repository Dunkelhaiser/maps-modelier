/* eslint-disable no-bitwise */
import { ImageData, createCanvas, loadImage } from "@napi-rs/canvas";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { provinces } from "../../db/schema.js";
import { extractProvinceShapes } from "./extractProvinceShapes.js";

const rgbToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};

export const processProvinces = async (_: Electron.IpcMainInvokeEvent, imageData: string, mapId: string) => {
    const image = await loadImage(imageData);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.willReadFrequently = true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height) as ImageData;
    const { data, width } = imageDataObj;

    const colorSet = new Set<number>();
    const rowWidth4 = width * 4;

    for (let i = 0, rowOffset = 0; i < canvas.height; i++, rowOffset += rowWidth4) {
        for (let x = 0, pixelOffset = rowOffset; x < width; x++, pixelOffset += 4) {
            const r = data[pixelOffset];
            const g = data[pixelOffset + 1];
            const b = data[pixelOffset + 2];
            const colorKey = (r << 16) | (g << 8) | b;
            colorSet.add(colorKey);
        }
    }

    const uniqueColors = Array.from(colorSet).map((color) => {
        const r = (color >> 16) & 255;
        const g = (color >> 8) & 255;
        const b = color & 255;

        return rgbToHex(r, g, b);
    });

    await db.transaction(async (tx) => {
        const provinceValues = Array.from(uniqueColors).map((color, index) => ({
            id: index + 1,
            mapId,
            color,
        }));

        for (let i = 0; i < provinceValues.length; i += 1000) {
            await tx.insert(provinces).values(provinceValues.slice(i, i + 1000));
        }
    });

    const mapProvinces = await db.select().from(provinces).where(eq(provinces.mapId, mapId)).orderBy(provinces.id);

    const provinceShapes = await extractProvinceShapes(_, imageData, mapProvinces);

    await db.transaction(async (tx) => {
        for (const province of mapProvinces) {
            const shape = provinceShapes[province.id];

            const shapes = Array.isArray(shape) ? shape : [shape];

            await tx
                .update(provinces)
                .set({ shape: shapes.map((polygon) => polygon.points) })
                .where(and(eq(provinces.id, province.id), eq(provinces.mapId, mapId)));
        }
    });

    return mapProvinces;
};
