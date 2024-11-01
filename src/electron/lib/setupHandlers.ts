import { ipcMain } from "electron";
import { saveMapImage } from "./saveMapImage.js";

export const setupHandlers = () => {
    ipcMain.handle("saveMapImage", saveMapImage);
};
