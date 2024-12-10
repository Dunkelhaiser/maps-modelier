import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db.js";
import { states, stateProvinces, provinces as provincesTable } from "../../db/schema.js";

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

    let stateType = "land";

    if (provinces) {
        const provinceTypes = await db
            .select({
                type: provincesTable.type,
            })
            .from(provincesTable)
            .where(and(inArray(provincesTable.id, provinces), eq(provincesTable.mapId, mapId)));

        const uniqueTypes = new Set(provinceTypes.map((province) => province.type));
        if (uniqueTypes.size > 1) {
            throw new Error("Cannot create a state with provinces of different types");
        }
        [stateType] = Array.from(uniqueTypes);
    }

    const [createdState] = await db
        .insert(states)
        .values({
            mapId,
            name,
            type: stateType,
        })
        .returning({
            id: states.id,
            name: states.name,
            type: states.type,
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
