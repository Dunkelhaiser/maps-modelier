import { ipcMain } from "electron";
import { loadMapImage } from "./mapImage/loadMapImage.js";
import { saveMapImage } from "./mapImage/saveMapImage.js";
import { createMap } from "./maps/createMap.js";
import { getMaps } from "./maps/getMaps.js";
import { updateMapName } from "./maps/updateMapName.js";

export const setupHandlers = () => {
    ipcMain.handle("saveMapImage", saveMapImage);
    ipcMain.handle("loadMapImage", loadMapImage);
    ipcMain.handle("getMaps", getMaps);
    ipcMain.handle("createMap", createMap);
    ipcMain.handle("updateMapName", updateMapName);
};
