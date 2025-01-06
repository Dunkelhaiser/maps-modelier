import fs from "fs/promises";
import path from "path";

const mimeTypes: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    bmp: "image/bmp",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
};

export const loadFile = async (filePath: string) => {
    if (filePath === "") return "";

    const buffer = await fs.readFile(filePath);
    const extension = path.extname(filePath).slice(1).toLowerCase();

    const mimeType = mimeTypes[extension] || "application/octet-stream";

    return `data:${mimeType};base64,${buffer.toString("base64")}`;
};
