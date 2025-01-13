import fs from "fs/promises";
import path from "path";
import { app } from "electron";

export const deleteFile = async (fileName: string, directory = ["media"]) => {
    const userDataPath = app.getPath("userData");
    const directoryPath = path.join(userDataPath, ...directory);
    const filePath = path.join(directoryPath, fileName);

    try {
        await fs.access(filePath);
    } catch {
        // if file does not exist silently return
        return;
    }

    await fs.unlink(filePath);
};
