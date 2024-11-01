import path from "path";
import config from "dotenv";
import { app, BrowserWindow } from "electron";

config.config();

app.on("ready", () => {
    const mainWindow = new BrowserWindow({});

    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL("http://localhost:5173");
    } else {
        mainWindow.setMenu(null);
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist/client/index.html"));
    }
});
