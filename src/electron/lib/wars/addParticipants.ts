import { and, eq, inArray } from "drizzle-orm";
import { IpcMainInvokeEvent } from "electron";
import { AddParticipantsInput, addParticipantsSchema } from "../../../shared/schemas/wars/addParticipants.js";
import { db } from "../../db/db.js";
import { warParticipants, wars, warSides } from "../../db/schema.js";

export const addParticipants = async (
    _event: IpcMainInvokeEvent,
    mapId: string,
    id: number,
    data: AddParticipantsInput
) => {
    const participants = await addParticipantsSchema.parseAsync(data);

    return db.transaction(async (tx) => {
        const existingWar = await tx
            .select({
                id: wars.id,
                aggressor: wars.aggressor,
                defender: wars.defender,
            })
            .from(wars)
            .where(and(eq(wars.mapId, mapId), eq(wars.id, id)));

        if (existingWar.length === 0) throw new Error("War not found");

        const [war] = existingWar;

        const sideIds = [...new Set(participants.map((p) => p.sideId))];
        if (sideIds.length > 0) {
            const existingSides = await tx
                .select({ id: warSides.id })
                .from(warSides)
                .where(and(eq(warSides.mapId, mapId), eq(warSides.warId, id), inArray(warSides.id, sideIds)));

            if (existingSides.length !== sideIds.length) {
                throw new Error("One or more sides do not exist");
            }
        }

        const existingParticipants = await tx
            .select()
            .from(warParticipants)
            .where(and(eq(warParticipants.mapId, mapId), eq(warParticipants.warId, id)));

        const existingSet = new Set(existingParticipants.map((p) => `${p.countryId}-${p.sideId}`));

        const newSet = new Set(participants.map((p) => `${p.countryId}-${p.sideId}`));

        const toRemove = existingParticipants.filter((p) => {
            if (p.countryId === war.aggressor || p.countryId === war.defender) {
                return false;
            }
            return !newSet.has(`${p.countryId}-${p.sideId}`);
        });

        const toAdd = participants.filter((p) => !existingSet.has(`${p.countryId}-${p.sideId}`));

        if (toRemove.length > 0) {
            for (const participant of toRemove) {
                await tx
                    .delete(warParticipants)
                    .where(
                        and(
                            eq(warParticipants.mapId, mapId),
                            eq(warParticipants.warId, id),
                            eq(warParticipants.countryId, participant.countryId),
                            eq(warParticipants.sideId, participant.sideId)
                        )
                    );
            }
        }

        if (toAdd.length > 0) {
            await tx
                .insert(warParticipants)
                .values(
                    toAdd.map((p) => ({
                        mapId,
                        warId: id,
                        countryId: p.countryId,
                        sideId: p.sideId,
                    }))
                )
                .onConflictDoNothing();
        }
    });
};
