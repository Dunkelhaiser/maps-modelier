import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { stateProvinces } from "../../db/schema.js";

export const removeProvinces = async (_: Electron.IpcMainInvokeEvent, mapId: string, provinces: number[]) => {
    provinces.forEach(async (provinceId) => {
        await db
            .delete(stateProvinces)
            .where(and(eq(stateProvinces.provinceId, provinceId), eq(stateProvinces.mapId, mapId)));
    });
};
