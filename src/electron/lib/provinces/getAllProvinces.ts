import { eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { provinces } from "../../db/schema.js";

export const getAllProvinces = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const provincesArr = await db
        .select({
            id: provinces.id,
            color: provinces.color,
            type: provinces.type,
        })
        .from(provinces)
        .where(eq(provinces.mapId, mapId))
        .orderBy(provinces.id);

    return provincesArr;
};
