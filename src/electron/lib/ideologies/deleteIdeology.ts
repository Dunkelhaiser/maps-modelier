import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { ideologies } from "../../db/schema.js";

export const deleteIdeology = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    await db.delete(ideologies).where(and(eq(ideologies.id, id), eq(ideologies.mapId, mapId)));
};
