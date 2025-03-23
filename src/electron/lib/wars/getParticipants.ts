import { eq, and } from "drizzle-orm";
import { IpcMainInvokeEvent } from "electron";
import { db } from "../../db/db.js";
import { warSides, warParticipants, wars } from "../../db/schema.js";
import { getCountryBase } from "../countries/getCountryBase.js";

export const getParticipants = async (_event: IpcMainInvokeEvent, mapId: string, id: number) => {
    const existingWar = await db
        .select({ id: wars.id })
        .from(wars)
        .where(and(eq(wars.mapId, mapId), eq(wars.id, id)));

    if (existingWar.length === 0) throw new Error("War not found");

    const sides = await db
        .select()
        .from(warSides)
        .where(and(eq(warSides.mapId, mapId), eq(warSides.warId, id)));

    const sidesWithParticipants = await Promise.all(
        sides.map(async (side) => {
            const participants = await db
                .select({
                    countryId: warParticipants.countryId,
                })
                .from(warParticipants)
                .where(
                    and(
                        eq(warParticipants.mapId, mapId),
                        eq(warParticipants.warId, id),
                        eq(warParticipants.sideId, side.id)
                    )
                );

            const participantsData = await Promise.all(
                participants.map(async (participant) => getCountryBase(mapId, participant.countryId))
            );

            return {
                id: side.id,
                name: side.side,
                participantCount: participantsData.length,
                participants: participantsData,
            };
        })
    );

    return {
        sides: sidesWithParticipants,
        totalParticipants: sidesWithParticipants.reduce((total, side) => total + side.participantCount, 0),
    };
};
