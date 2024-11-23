import { db } from "../../db/db.js";
import { states, stateProvinces } from "../../db/schema.js";

export const createState = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    name: string,
    provinces?: number[]
) => {
    const [createdState] = await db
        .insert(states)
        .values({
            mapId,
            name,
        })
        .returning();

    if (provinces) {
        await db.insert(stateProvinces).values(
            provinces.map((provinceId) => ({
                stateId: createdState.id,
                provinceId,
                mapId,
            }))
        );
    }

    return createdState;
};
