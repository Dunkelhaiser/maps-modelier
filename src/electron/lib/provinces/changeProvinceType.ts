import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { provinces } from "../../db/schema.js";

export const changeProvinceType = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    id: number,
    type: "land" | "water"
) => {
    const updatedProvince = await db
        .update(provinces)
        .set({ type })
        .where(and(eq(provinces.mapId, mapId), eq(provinces.id, id)))
        .returning();

    return updatedProvince.length > 0 ? updatedProvince[0] : null;
};
