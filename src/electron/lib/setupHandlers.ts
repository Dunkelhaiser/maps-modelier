import { ipcMain } from "electron";
import { loadMapImage } from "./mapImage/loadMapImage.js";
import { saveMapImage } from "./mapImage/saveMapImage.js";

export const setupHandlers = () => {
    ipcMain.handle("saveMapImage", saveMapImage);
    ipcMain.handle("loadMapImage", loadMapImage);
};
