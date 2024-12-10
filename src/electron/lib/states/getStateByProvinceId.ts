import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../db/db.js";
import { stateProvinces, states } from "../../db/schema.js";

export const getStateByProvinceId = async (_: Electron.IpcMainInvokeEvent, mapId: string, provinceId: number) => {
    const state = await db
        .select({
            id: states.id,
            name: states.name,
            type: states.type,
            provinces: sql`GROUP_CONCAT(${stateProvinces.provinceId})`,
        })
        .from(states)
        .leftJoin(stateProvinces, eq(stateProvinces.stateId, states.id))
        .where(
            and(
                eq(states.mapId, mapId),
                inArray(
                    states.id,
                    db
                        .select({ stateId: stateProvinces.stateId })
                        .from(stateProvinces)
                        .where(eq(stateProvinces.provinceId, provinceId))
                )
            )
        )
        .groupBy(states.id, states.name, states.createdAt, states.updatedAt);

    if (state.length === 0) return null;

    const [result] = state;
    result.provinces = result.provinces ? (result.provinces as string).split(",").map(Number) : [];

    return result;
};
