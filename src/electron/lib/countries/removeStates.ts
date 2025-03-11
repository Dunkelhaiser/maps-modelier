import { and, eq, inArray } from "drizzle-orm";
import { StatesAssignmentInput, statesAssignmetSchema } from "../../../shared/schemas/countries/states.js";
import { db } from "../../db/db.js";
import { countryStates } from "../../db/schema.js";

export const removeStates = async (_: Electron.IpcMainInvokeEvent, mapId: string, data: StatesAssignmentInput) => {
    const { countryTag, states } = await statesAssignmetSchema.parseAsync(data);

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
