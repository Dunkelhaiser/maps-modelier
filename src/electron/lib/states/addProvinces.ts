import { and, eq, inArray, ne } from "drizzle-orm";
import { ProvincesAssignmentInput, provincesAssignmetSchema } from "../../../shared/schemas/states/provinces.js";
import { db } from "../../db/db.js";
import { stateProvinces } from "../../db/schema.js";

export const addProvinces = async (_: Electron.IpcMainInvokeEvent, mapId: string, data: ProvincesAssignmentInput) => {
    const { stateId, provinces } = await provincesAssignmetSchema.parseAsync(data);

    await db.transaction(async (tx) => {
        await tx
            .delete(stateProvinces)
            .where(
                and(
                    eq(stateProvinces.mapId, mapId),
                    ne(stateProvinces.stateId, stateId),
                    inArray(stateProvinces.provinceId, provinces)
                )
            );

        await tx
            .insert(stateProvinces)
            .values(
                provinces.map((provinceId) => ({
                    stateId,
                    provinceId,
                    mapId,
                }))
            )
            .onConflictDoNothing();
    });
};
