import { and, eq, inArray } from "drizzle-orm";
import { ChangeTypeInput, changeTypeSchema } from "../../../shared/schemas/provinces/changeType.js";
import { db } from "../../db/db.js";
import { countryStates, provinces, stateProvinces, states } from "../../db/schema.js";

export const changeProvinceType = async (_: Electron.IpcMainInvokeEvent, mapId: string, data: ChangeTypeInput) => {
    const { provinceIds: id, type } = await changeTypeSchema.parseAsync(data);

    let provinceIds = Array.isArray(id) ? id : [id];

    const stateIds = await db
        .select({ stateId: stateProvinces.stateId })
        .from(stateProvinces)
        .where(and(inArray(stateProvinces.provinceId, provinceIds), eq(stateProvinces.mapId, mapId)))
        .groupBy(stateProvinces.stateId);

    const stateIdsArr = stateIds.map((state) => state.stateId);

    if (stateIds.length > 0) {
        const stateProvinceQuery = await db
            .select({ id: stateProvinces.provinceId })
            .from(stateProvinces)
            .where(and(inArray(stateProvinces.stateId, stateIdsArr), eq(stateProvinces.mapId, mapId)));

        provinceIds = [...new Set([...provinceIds, ...stateProvinceQuery.map((p) => p.id)])];
    }

    if (type === "water") {
        await db
            .delete(countryStates)
            .where(and(inArray(countryStates.stateId, stateIdsArr), eq(countryStates.mapId, mapId)));
    }

    await db
        .update(provinces)
        .set({ type })
        .where(and(eq(provinces.mapId, mapId), inArray(provinces.id, provinceIds)));

    if (stateIds.length > 0) {
        await db
            .update(states)
            .set({ type })
            .where(and(inArray(states.id, stateIdsArr), eq(states.mapId, mapId)));
    }
};
