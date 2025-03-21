import { and, eq, inArray, ne } from "drizzle-orm";
import { StatesAssignmentInput, statesAssignmetSchema } from "../../../shared/schemas/countries/states.js";
import { db } from "../../db/db.js";
import { countryStates } from "../../db/schema.js";

export const addStates = async (_: Electron.IpcMainInvokeEvent, mapId: string, data: StatesAssignmentInput) => {
    const { countryId, states } = await statesAssignmetSchema.parseAsync(data);

    await db.transaction(async (tx) => {
        await tx
            .delete(countryStates)
            .where(
                and(
                    eq(countryStates.mapId, mapId),
                    ne(countryStates.countryId, countryId),
                    inArray(countryStates.stateId, states)
                )
            );

        await db
            .insert(countryStates)
            .values(
                states.map((stateId) => ({
                    countryId,
                    stateId,
                    mapId,
                }))
            )
            .onConflictDoNothing();
    });
};
