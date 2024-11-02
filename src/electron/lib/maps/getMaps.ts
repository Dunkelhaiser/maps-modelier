import { db } from "../../db/db.js";
import { maps } from "../../db/schema.js";

export const getMaps = async (_: Electron.IpcMainInvokeEvent) => {
    const result = await db.select().from(maps).orderBy(maps.name);
    return result;
};
