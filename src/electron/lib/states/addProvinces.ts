import { and, eq, ne } from "drizzle-orm";
import { db } from "../../db/db.js";
import { stateProvinces } from "../../db/schema.js";

export const addProvinces = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    stateId: number,
    provinces: number[]
) => {
    provinces.forEach(async (provinceId) => {
        await db
            .delete(stateProvinces)
            .where(
                and(
                    eq(stateProvinces.provinceId, provinceId),
                    ne(stateProvinces.stateId, stateId),
                    eq(stateProvinces.mapId, mapId)
                )
            );
    });

    await db.insert(stateProvinces).values(
        provinces.map((provinceId) => ({
            stateId,
            provinceId,
            mapId,
        }))
    );
};
