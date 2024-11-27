import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { states, stateProvinces } from "../../db/schema.js";

export const createState = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    name: string,
    provinces?: number[]
) => {
    provinces?.forEach(async (provinceId) => {
        await db
            .delete(stateProvinces)
            .where(and(eq(stateProvinces.provinceId, provinceId), eq(stateProvinces.mapId, mapId)));
    });

    const [createdState] = await db
        .insert(states)
        .values({
            mapId,
            name,
        })
        .returning({
            id: states.id,
            name: states.name,
        });

    if (provinces) {
        await db.insert(stateProvinces).values(
            provinces.map((provinceId) => ({
                stateId: createdState.id,
                provinceId,
                mapId,
            }))
        );
    }

    return { ...createdState, provinces };
};
