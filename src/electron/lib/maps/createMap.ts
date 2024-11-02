import { db } from "../../db/db.js";
import { maps } from "../../db/schema.js";
import { processProvinces } from "./processProvinces.js";

export const createMap = async (_: Electron.IpcMainInvokeEvent, name: string, imageData: string) => {
    const newMap = await db.transaction(async (tx) => {
        const mapRes = await tx.insert(maps).values({ name }).returning();

        const createdMap = mapRes.length > 0 ? mapRes[0] : null;

        if (createdMap) {
            await processProvinces(_, imageData, createdMap.id);
        }

        return createdMap;
    });

    return newMap;
};
