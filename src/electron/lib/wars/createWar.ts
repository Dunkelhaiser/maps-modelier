import { IpcMainInvokeEvent } from "electron";
import { WarInput, warSchema } from "../../../shared/schemas/wars/war.js";
import { db } from "../../db/db.js";
import { wars, warSides, warParticipants } from "../../db/schema.js";

export const createWar = async (_event: IpcMainInvokeEvent, mapId: string, data: WarInput) => {
    const validatedData = await warSchema.parseAsync(data);

    return db.transaction(async (tx) => {
        const [war] = await tx
            .insert(wars)
            .values({
                mapId,
                ...validatedData,
            })
            .returning({ id: wars.id });

        const [attackerSide] = await tx
            .insert(warSides)
            .values({
                warId: war.id,
                side: "attacker",
                mapId,
            })
            .returning({ id: warSides.id });

        const [defenderSide] = await tx
            .insert(warSides)
            .values({
                warId: war.id,
                side: "defender",
                mapId,
            })
            .returning({ id: warSides.id });

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

        return war;
    });
};
