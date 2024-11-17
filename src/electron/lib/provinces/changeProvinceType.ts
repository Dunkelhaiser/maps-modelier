import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db.js";
import { provinces } from "../../db/schema.js";

export const changeProvinceType = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    id: number[],
    type: "land" | "water"
) => {
    const provinceIds = Array.isArray(id) ? id : [id];

    const updatedProvinces = await db
        .update(provinces)
        .set({ type })
        .where(and(eq(provinces.mapId, mapId), inArray(provinces.id, provinceIds)))
        .returning();

    return updatedProvinces;
};
