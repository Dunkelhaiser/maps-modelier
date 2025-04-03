import { and, eq } from "drizzle-orm";
import { IpcMainInvokeEvent } from "electron";
import { WarInput, warSchema } from "../../../shared/schemas/wars/war.js";
import { db } from "../../db/db.js";
import { wars, warSides, warParticipants } from "../../db/schema.js";
import { checkWarExistence } from "./checkWarExistence.js";

export const updateWar = async (_event: IpcMainInvokeEvent, mapId: string, id: number, data: WarInput) => {
    const validatedData = await warSchema.parseAsync(data);

    await checkWarExistence(mapId, id);

    return db.transaction(async (tx) => {
        const [war] = await tx
            .update(wars)
            .set(validatedData)
            .where(and(eq(wars.mapId, mapId), eq(wars.id, id)))
            .returning({ id: wars.id });

        const [attackerSide] = await tx
            .select({ id: warSides.id })
            .from(warSides)
            .where(and(eq(warSides.warId, war.id), eq(warSides.side, "attacker"), eq(warSides.mapId, mapId)));

        const [defenderSide] = await tx
            .select({ id: warSides.id })
            .from(warSides)
            .where(and(eq(warSides.warId, war.id), eq(warSides.side, "defender"), eq(warSides.mapId, mapId)));

        await tx
            .insert(warParticipants)
            .values({
                sideId: attackerSide.id,
                warId: war.id,
                countryId: data.aggressor,
                mapId,
            })
            .onConflictDoNothing();

        await tx
            .insert(warParticipants)
            .values({
                sideId: defenderSide.id,
                warId: war.id,
                countryId: data.defender,
                mapId,
            })
            .onConflictDoNothing();
    });
};
