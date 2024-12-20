import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { ethnicities } from "../../db/schema.js";

export const deleteEthnicity = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    await db.delete(ethnicities).where(and(eq(ethnicities.id, id), eq(ethnicities.mapId, mapId)));
};
