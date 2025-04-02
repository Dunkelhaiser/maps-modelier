import path from "path";
import config from "dotenv";
import { app, BrowserWindow } from "electron";
import { executeMigrations } from "./db/db.js";
import { setupHandlers } from "./lib/setupHandlers.js";

config.config();

const isDevelopment = process.env.NODE_ENV === "development";

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegrationInWorker: true,
            preload: path.join(app.getAppPath(), isDevelopment ? "." : "..", "/dist/electron/preload.cjs"),
            sandbox: false,
            contextIsolation: true,
        },
    });

    mainWindow.maximize();
    mainWindow.show();

    if (isDevelopment) {
        mainWindow.loadURL("http://localhost:5173");
    } else {
        mainWindow.setMenu(null);
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist/client/index.html"));
    }

    return mainWindow;
};

const initializeApp = async () => {
    createMainWindow();
    await executeMigrations();
    setupHandlers();
};

app.on("ready", initializeApp);
