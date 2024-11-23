import { eq, sql } from "drizzle-orm";
import { db } from "../../db/db.js";
import { states, stateProvinces } from "../../db/schema.js";

export const getAllStates = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const statesArr = await db
        .select({
            id: states.id,
            name: states.name,
            provinces: sql`GROUP_CONCAT(${stateProvinces.provinceId})`,
        })
        .from(states)
        .leftJoin(stateProvinces, eq(stateProvinces.stateId, states.id))
        .where(eq(states.mapId, mapId))
        .orderBy(states.id);

    return statesArr;
};
