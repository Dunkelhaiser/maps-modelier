import fs from "fs/promises";
import path from "path";

export const loadMapImage = async (_: Electron.IpcMainInvokeEvent, imagePath: string) => {
    const buffer = await fs.readFile(imagePath);
    const extension = path.extname(imagePath).slice(1);
    return `data:image/${extension};base64,${buffer.toString("base64")}`;
};
