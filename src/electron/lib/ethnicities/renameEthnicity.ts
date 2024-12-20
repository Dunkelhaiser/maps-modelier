import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { ethnicities } from "../../db/schema.js";

export const renameEthnicity = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number, name: string) => {
    const [updatedEthnicity] = await db
        .update(ethnicities)
        .set({ name })
        .where(and(eq(ethnicities.id, id), eq(ethnicities.mapId, mapId)))
        .returning({
            id: ethnicities.id,
            name: ethnicities.name,
        });

    return updatedEthnicity;
};
