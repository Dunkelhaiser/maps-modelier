import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { wars } from "../../db/schema.js";

export const deleteWar = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    await db.delete(wars).where(and(eq(wars.mapId, mapId), eq(wars.id, id)));
};
