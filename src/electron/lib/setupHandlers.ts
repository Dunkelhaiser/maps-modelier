import { ipcMain } from "electron";
import { loadMapImage } from "./mapImage/loadMapImage.js";
import { saveMapImage } from "./mapImage/saveMapImage.js";
import { createMap } from "./maps/createMap.js";
import { getMaps } from "./maps/getMaps.js";
import { updateMapName } from "./maps/updateMapName.js";
import { changeProvinceType } from "./provinces/changeProvinceType.js";
import { extractProvinceShapes } from "./provinces/extractProvinceShapes.js";
import { getAllProvinces } from "./provinces/getAllProvinces.js";
import { getProvinceByColor } from "./provinces/getProvinceByColor.js";
import { getProvinceById } from "./provinces/getProvinceById.js";

export const setupHandlers = () => {
    ipcMain.handle("saveMapImage", saveMapImage);
    ipcMain.handle("loadMapImage", loadMapImage);
    ipcMain.handle("getMaps", getMaps);
    ipcMain.handle("createMap", createMap);
    ipcMain.handle("updateMapName", updateMapName);
    ipcMain.handle("getAllProvinces", getAllProvinces);
    ipcMain.handle("getProvinceByColor", getProvinceByColor);
    ipcMain.handle("getProvinceById", getProvinceById);
    ipcMain.handle("extractProvinceShapes", extractProvinceShapes);
    ipcMain.handle("changeProvinceType", changeProvinceType);
};
