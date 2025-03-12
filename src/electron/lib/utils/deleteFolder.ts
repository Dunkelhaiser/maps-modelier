import fs from "fs/promises";
import path from "path";
import { app } from "electron";

export const deleteFolder = async (folderName: string, directory = ["media"]) => {
    if (folderName === "") return;

    const userDataPath = app.getPath("userData");
    const directoryPath = path.join(userDataPath, ...directory);
    const folderPath = path.join(directoryPath, folderName);

    try {
        await fs.access(folderPath);
    } catch {
        // if folder does not exist silently return
        return;
    }

    await fs.rm(folderPath, { recursive: true, force: true });
};
