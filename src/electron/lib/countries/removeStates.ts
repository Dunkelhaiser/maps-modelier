import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countryStates } from "../../db/schema.js";

export const removeStates = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    countryTag: string,
    states: number[]
) => {
    await db
        .delete(countryStates)
        .where(
            and(
                eq(countryStates.mapId, mapId),
                eq(countryStates.countryTag, countryTag),
                inArray(countryStates.stateId, states)
            )
        );
};
