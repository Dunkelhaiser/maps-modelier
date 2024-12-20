import { db } from "../../db/db.js";
import { ethnicities } from "../../db/schema.js";

export const createEthnicity = async (_: Electron.IpcMainInvokeEvent, mapId: string, name: string) => {
    const [createdEthnicity] = await db
        .insert(ethnicities)
        .values({
            mapId,
            name,
        })
        .returning({
            id: ethnicities.id,
            name: ethnicities.name,
        });

    return createdEthnicity;
};
