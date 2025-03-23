import { getTableColumns } from "drizzle-orm";
import { IpcMainInvokeEvent } from "electron";
import { WarInput, warSchema } from "../../../shared/schemas/wars/war.js";
import { db } from "../../db/db.js";
import { wars, warSides, warParticipants } from "../../db/schema.js";
import { getCountryBase } from "../countries/getCountryBase.js";

export const createWar = async (_event: IpcMainInvokeEvent, mapId: string, data: WarInput) => {
    const validatedData = await warSchema.parseAsync(data);
    const { mapId: mapIdCol, createdAt, updatedAt, ...cols } = getTableColumns(wars);

    return db.transaction(async (tx) => {
        const defenderData = await getCountryBase(mapId, data.defender);
        const attackerData = await getCountryBase(mapId, data.aggressor);

        const [war] = await tx
            .insert(wars)
            .values({
                mapId,
                ...validatedData,
            })
            .returning(cols);

        const [attackerSide] = await tx
            .insert(warSides)
            .values({
                warId: war.id,
                side: "attacker",
                mapId,
            })
            .returning();

        const [defenderSide] = await tx
            .insert(warSides)
            .values({
                warId: war.id,
                side: "defender",
                mapId,
            })
            .returning();

        await tx.insert(warParticipants).values({
            sideId: attackerSide.id,
            warId: war.id,
            countryId: data.aggressor,
            mapId,
        });

        await tx.insert(warParticipants).values({
            sideId: defenderSide.id,
            warId: war.id,
            countryId: data.defender,
            mapId,
        });

        return {
            ...war,
            aggressor: attackerData,
            defender: defenderData,
        };
    });
};
