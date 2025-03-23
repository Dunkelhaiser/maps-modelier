import { and, eq, getTableColumns } from "drizzle-orm";
import { IpcMainInvokeEvent } from "electron";
import { WarInput, warSchema } from "../../../shared/schemas/wars/war.js";
import { db } from "../../db/db.js";
import { wars, warSides, warParticipants } from "../../db/schema.js";
import { getCountryBase } from "../countries/getCountryBase.js";

export const updateWar = async (_event: IpcMainInvokeEvent, mapId: string, id: number, data: WarInput) => {
    const validatedData = await warSchema.parseAsync(data);
    const { mapId: mapIdCol, createdAt, updatedAt, ...cols } = getTableColumns(wars);

    return db.transaction(async (tx) => {
        const defenderData = await getCountryBase(mapId, data.defender);
        const attackerData = await getCountryBase(mapId, data.aggressor);

        const [war] = await tx
            .update(wars)
            .set(validatedData)
            .where(and(eq(wars.mapId, mapId), eq(wars.id, id)))
            .returning(cols);

        const [attackerSide] = await tx
            .select({ id: warSides.id })
            .from(warSides)
            .where(and(eq(warSides.warId, war.id), eq(warSides.side, "attacker"), eq(warSides.mapId, mapId)));

        const [defenderSide] = await tx
            .select({ id: warSides.id })
            .from(warSides)
            .where(and(eq(warSides.warId, war.id), eq(warSides.side, "defender"), eq(warSides.mapId, mapId)));

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
