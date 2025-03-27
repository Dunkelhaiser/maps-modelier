import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { politicalParties } from "../../db/schema.js";

export const deleteParty = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    await db.delete(politicalParties).where(and(eq(politicalParties.mapId, mapId), eq(politicalParties.id, id)));
};
