import path from "path";
import dotenv from "dotenv";
import { app, BrowserWindow } from "electron";
import { executeMigrations } from "./db/db.js";
import { setupHandlers } from "./setupHandlers.js";

dotenv.config();

const isDevelopment = process.env.NODE_ENV === "development";

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(app.getAppPath(), isDevelopment ? "." : "..", "/dist/electron/preload.cjs"),
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
