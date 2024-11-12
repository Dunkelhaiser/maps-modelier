import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { provinces } from "../../db/schema.js";

export const getProvinceById = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    const province = await db
        .select({
            id: provinces.id,
            color: provinces.color,
            type: provinces.type,
            shape: provinces.shape,
        })
        .from(provinces)
        .where(and(eq(provinces.mapId, mapId), eq(provinces.id, id)));

    return province.length > 0 ? province[0] : null;
};
