import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { provinces } from "../../db/schema.js";

export const getProvinceByColor = async (_: Electron.IpcMainInvokeEvent, mapId: string, color: string) => {
    const province = await db
        .select({
            id: provinces.id,
            color: provinces.color,
            type: provinces.type,
        })
        .from(provinces)
        .where(and(eq(provinces.mapId, mapId), eq(provinces.color, color)));

    return province.length > 0 ? province[0] : null;
};
