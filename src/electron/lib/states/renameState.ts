import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { states } from "../../db/schema.js";

export const renameState = async (_: Electron.IpcMainInvokeEvent, mapId: string, stateId: number, name: string) => {
    const [updatedState] = await db
        .update(states)
        .set({ name })
        .where(and(eq(states.id, stateId), eq(states.mapId, mapId)))
        .returning({
            id: states.id,
            name: states.name,
            type: states.type,
        });

    return updatedState;
};
