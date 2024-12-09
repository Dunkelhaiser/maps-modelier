import { and, eq, inArray, ne } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countryStates } from "../../db/schema.js";

export const addStates = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    countryTag: string,
    states: number[]
) => {
    await db.transaction(async (tx) => {
        await tx
            .delete(countryStates)
            .where(
                and(
                    eq(countryStates.mapId, mapId),
                    ne(countryStates.countryTag, countryTag),
                    inArray(countryStates.stateId, states)
                )
            );

        await db
            .insert(countryStates)
            .values(
                states.map((stateId) => ({
                    countryTag,
                    stateId,
                    mapId,
                }))
            )
            .onConflictDoNothing();
    });
};
