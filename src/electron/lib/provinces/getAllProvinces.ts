import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { provinces } from "../../db/schema.js";

export const getAllProvinces = async (_: Electron.IpcMainInvokeEvent, mapId: string, type?: "land" | "water") => {
    const provincesArr = await db
        .select({
            id: provinces.id,
            color: provinces.color,
            type: provinces.type,
        })
        .from(provinces)
        .where(and(eq(provinces.mapId, mapId), type ? eq(provinces.type, type) : undefined))
        .orderBy(provinces.id);

    return provincesArr;
};
