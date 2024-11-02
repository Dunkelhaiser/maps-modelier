import { db } from "../../db/db.js";
import { maps } from "../../db/schema.js";

export const createMap = async (_: Electron.IpcMainInvokeEvent, name: string) => {
    const newMap = await db.insert(maps).values({ name }).returning();
    return newMap.length > 0 ? newMap[0] : null;
};
