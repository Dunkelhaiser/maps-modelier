import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { alliances } from "../../db/schema.js";

export const deleteAlliance = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    await db.delete(alliances).where(and(eq(alliances.mapId, mapId), eq(alliances.id, id)));
};
