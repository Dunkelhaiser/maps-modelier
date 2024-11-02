import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { app } from "electron";
import * as schema from "./schema.js";

const dbPath = process.env.NODE_ENV === "development" ? "data.db" : path.join(app.getPath("userData"), "data.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const sql = new Database(dbPath);

export const db = drizzle(sql, { schema });

export const executeMigrations = async () => {
    migrate(db, {
        migrationsFolder: path.join(import.meta.dirname, "./migrations"),
    });
};
