import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db.js";
import { provinces, stateProvinces } from "../../db/schema.js";

export const changeProvinceType = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    id: number[],
    type: "land" | "water"
) => {
    let provinceIds = Array.isArray(id) ? id : [id];

    const stateId = await db
        .select({ stateId: stateProvinces.stateId })
        .from(stateProvinces)
        .where(eq(stateProvinces.provinceId, provinceIds[0]))
        .groupBy(stateProvinces.stateId);

    if (stateId.length > 0) {
        const stateProvinceQuery = await db
            .select({ id: stateProvinces.provinceId })
            .from(stateProvinces)
            .where(eq(stateProvinces.stateId, stateId[0].stateId));

        provinceIds = stateProvinceQuery.map((p) => p.id);
    }

    const updatedProvinces = await db
        .update(provinces)
        .set({ type })
        .where(and(eq(provinces.mapId, mapId), inArray(provinces.id, provinceIds)))
        .returning();

    return updatedProvinces;
};
