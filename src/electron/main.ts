import path from "path";
import config from "dotenv";
import { app, BrowserWindow } from "electron";
import { executeMigrations } from "./db/db.js";
import { setupHandlers } from "./lib/setupHandlers.js";

config.config();

app.on("ready", async () => {
    const mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegrationInWorker: true,
            preload: path.join(
                app.getAppPath(),
                process.env.NODE_ENV === "development" ? "." : "..",
                "/dist/electron/preload.cjs"
            ),
            sandbox: false,
            contextIsolation: true,
        },
    });

    mainWindow.maximize();
    mainWindow.show();

    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL("http://localhost:5173");
    } else {
        mainWindow.setMenu(null);
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist/client/index.html"));
    }

    await executeMigrations();
    setupHandlers();
});
