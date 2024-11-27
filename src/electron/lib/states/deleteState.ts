import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { states } from "../../db/schema.js";

export const deleteState = async (_: Electron.IpcMainInvokeEvent, mapId: string, stateId: number) => {
    await db.delete(states).where(and(eq(states.id, stateId), eq(states.mapId, mapId)));
};
