import { CreateMapInput, createMapSchema } from "../../../shared/schemas/maps/createMap.js";
import { db } from "../../db/db.js";
import { maps } from "../../db/schema.js";
import { processProvinces } from "../provinces/processProvinces.js";

export const createMap = async (_: Electron.IpcMainInvokeEvent, data: CreateMapInput) => {
    const { name, provinces } = await createMapSchema.parseAsync(data);

    const newMap = await db.transaction(async (tx) => {
        const mapRes = await tx.insert(maps).values({ name }).returning();

        const createdMap = mapRes.length > 0 ? mapRes[0] : null;

        if (createdMap) {
            await processProvinces(_, provinces, createdMap.id);
        }

        return createdMap;
    });

    return newMap;
};
