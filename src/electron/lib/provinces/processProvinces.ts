import { ImageData, createCanvas, loadImage } from "@napi-rs/canvas";
import { eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { provinces } from "../../db/schema.js";

const rgbToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};

export const processProvinces = async (_: Electron.IpcMainInvokeEvent, imageData: string, mapId: string) => {
    const image = await loadImage(imageData);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height) as ImageData;
    const { data } = imageDataObj;

    const uniqueColors = new Set<string>();
    for (let i = 0; i < data.length; i += 4) {
        uniqueColors.add(rgbToHex(data[i], data[i + 1], data[i + 2]));
    }

    await db.transaction(async (tx) => {
        const provinceValues = Array.from(uniqueColors).map((color, index) => ({
            id: index + 1,
            mapId,
            color,
        }));

        await tx.insert(provinces).values(provinceValues);
    });

    const mapProvinces = await db
        .select({
            id: provinces.id,
            color: provinces.color,
            type: provinces.type,
        })
        .from(provinces)
        .where(eq(provinces.mapId, mapId))
        .orderBy(provinces.id);

    return mapProvinces;
};
