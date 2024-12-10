import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db.js";
import { provinces, stateProvinces, states } from "../../db/schema.js";

export const changeProvinceType = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    id: number[],
    type: "land" | "water"
) => {
    let provinceIds = Array.isArray(id) ? id : [id];

    const stateIds = await db
        .select({ stateId: stateProvinces.stateId })
        .from(stateProvinces)
        .where(inArray(stateProvinces.provinceId, provinceIds))
        .groupBy(stateProvinces.stateId);

    if (stateIds.length > 0) {
        const stateProvinceQuery = await db
            .select({ id: stateProvinces.provinceId })
            .from(stateProvinces)
            .where(
                inArray(
                    stateProvinces.stateId,
                    stateIds.map((state) => state.stateId)
                )
            );

        provinceIds = [...new Set([...provinceIds, ...stateProvinceQuery.map((p) => p.id)])];
    }

    const updatedProvinces = await db
        .update(provinces)
        .set({ type })
        .where(and(eq(provinces.mapId, mapId), inArray(provinces.id, provinceIds)))
        .returning();

    if (stateIds.length > 0) {
        await db
            .update(states)
            .set({ type })
            .where(
                inArray(
                    states.id,
                    stateIds.map((state) => state.stateId)
                )
            );
    }

    return updatedProvinces;
};
