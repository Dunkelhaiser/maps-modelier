import { and, count, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db.js";
import { stateProvinces } from "../../db/schema.js";
import { deleteState } from "./deleteState.js";

export const removeProvinces = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    stateId: number,
    provinces: number[]
) => {
    await db.transaction(async (tx) => {
        await tx
            .delete(stateProvinces)
            .where(
                and(
                    eq(stateProvinces.mapId, mapId),
                    eq(stateProvinces.stateId, stateId),
                    inArray(stateProvinces.provinceId, provinces)
                )
            );

        const [stateProvincesArr] = await tx
            .select({ count: count() })
            .from(stateProvinces)
            .where(and(eq(stateProvinces.stateId, stateId), eq(stateProvinces.mapId, mapId)));

        if (stateProvincesArr.count === 0) await deleteState(_, mapId, stateId);
    });
};
