import { and, eq } from "drizzle-orm";
import { StateNameInput, stateNameSchema } from "../../../shared/schemas/states/state.js";
import { db } from "../../db/db.js";
import { states } from "../../db/schema.js";

export const renameState = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    stateId: number,
    data: StateNameInput
) => {
    const { name } = await stateNameSchema.parseAsync(data);

    await db
        .update(states)
        .set({ name })
        .where(and(eq(states.id, stateId), eq(states.mapId, mapId)));
};
