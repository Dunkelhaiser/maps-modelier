import { eq, sql } from "drizzle-orm";
import { db } from "../../db/db.js";
import { states, stateProvinces } from "../../db/schema.js";

export const getAllStates = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const statesArr = await db
        .select({
            id: states.id,
            name: states.name,
            type: states.type,
            provinces: sql<string>`COALESCE(GROUP_CONCAT(DISTINCT ${stateProvinces.provinceId}), '')`,
        })
        .from(states)
        .leftJoin(stateProvinces, eq(stateProvinces.stateId, states.id))
        .where(eq(states.mapId, mapId))
        .groupBy(states.id)
        .orderBy(states.id);

    return statesArr.map((state) => ({
        ...state,
        provinces: state.provinces ? state.provinces.split(",").map(Number) : [],
    }));
};
