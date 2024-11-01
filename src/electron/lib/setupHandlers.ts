import { ipcMain } from "electron";
import { loadMapImage } from "./loadMapImage.js";
import { saveMapImage } from "./saveMapImage.js";

export const setupHandlers = () => {
    ipcMain.handle("saveMapImage", saveMapImage);
    ipcMain.handle("loadMapImage", loadMapImage);
};
