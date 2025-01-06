import fs from "fs/promises";
import path from "path";
import { app } from "electron";

export const saveFile = async (fileData: string, fileName: string, directory = ["media"]) => {
    const userDataPath = app.getPath("userData");
    const directoryPath = path.join(userDataPath, ...directory);
    await fs.mkdir(directoryPath, { recursive: true });

    const matches = /^data:(?<mimeType>[^;]+);base64,/.exec(fileData);

    if (!matches?.groups?.mimeType) throw new Error("Invalid file data format");

    const { mimeType } = matches.groups;
    const [, extension] = mimeType.split("/");

    const fullFileName = `${fileName}.${extension}`;
    const filePath = path.join(directoryPath, fullFileName);

    const base64Data = fileData.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    await fs.writeFile(filePath, buffer);

    return filePath;
};
