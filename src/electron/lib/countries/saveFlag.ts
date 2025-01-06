import fs from "fs/promises";
import path from "path";
import { app } from "electron";

export const saveFlag = async (mapId: string, flagData: string, countryName: string) => {
    const userDataPath = app.getPath("userData");
    const mapsDir = path.join(userDataPath, "flags");
    await fs.mkdir(mapsDir, { recursive: true });

    const matches = /^data:image\/(?<temp1>[a-zA-Z]+);base64,/.exec(flagData);
    if (!matches) throw new Error("Invalid image data");
    const [, extension] = matches;

    const fileName = `${mapId}-${countryName}-flag.${extension}`;
    const imgPath = path.join(mapsDir, fileName);

    const base64Data = flagData.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(imgPath, buffer);

    return imgPath;
};
