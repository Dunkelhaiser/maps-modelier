import { and, eq, inArray } from "drizzle-orm";
import { CreateStateInput, createStateSchema } from "../../../shared/schemas/states/createState.js";
import { db } from "../../db/db.js";
import { states, stateProvinces, provinces as provincesTable } from "../../db/schema.js";

export const createState = async (_: Electron.IpcMainInvokeEvent, mapId: string, data: CreateStateInput) => {
    const { name, provinces } = await createStateSchema.parseAsync(data);

    return await db.transaction(async (tx) => {
        if (provinces) {
            await tx
                .delete(stateProvinces)
                .where(and(inArray(stateProvinces.provinceId, provinces), eq(stateProvinces.mapId, mapId)));
        }

        let stateType = "land";

        if (provinces) {
            const provinceTypes = await tx
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

        const [createdState] = await tx
            .insert(states)
            .values({
                mapId,
                name,
                type: stateType as "land" | "water",
            })
            .returning({ id: states.id });

        if (provinces) {
            await tx.insert(stateProvinces).values(
                provinces.map((provinceId) => ({
                    stateId: createdState.id,
                    provinceId,
                    mapId,
                }))
            );
        }

        return createdState;
    });
};
