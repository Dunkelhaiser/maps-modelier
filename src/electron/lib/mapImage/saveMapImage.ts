import fs from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { app } from "electron";
import { db } from "../../db/db.js";
import { maps } from "../../db/schema.js";

export const saveMapImage = async (_: Electron.IpcMainInvokeEvent, imageData: string, mapId: string) => {
    const userDataPath = app.getPath("userData");
    const mapsDir = path.join(userDataPath, "maps");
    await fs.mkdir(mapsDir, { recursive: true });

    const matches = /^data:image\/(?<temp1>[a-zA-Z]+);base64,/.exec(imageData);
    if (!matches) throw new Error("Invalid image data");
    const [, extension] = matches;

    const fileName = `${mapId}.${extension}`;
    const imgPath = path.join(mapsDir, fileName);

    const base64Data = imageData.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(imgPath, buffer);

    await db.update(maps).set({ imgPath }).where(eq(maps.id, mapId)).returning();

    return imgPath;
};
