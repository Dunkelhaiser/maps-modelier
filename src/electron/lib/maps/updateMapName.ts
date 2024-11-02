import { eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { maps } from "../../db/schema.js";

export const updateMapName = async (_: Electron.IpcMainInvokeEvent, id: string, name: string) => {
    const updatedMap = await db.update(maps).set({ name }).where(eq(maps.id, id)).returning();
    return updatedMap.length > 0 ? updatedMap[0] : null;
};
