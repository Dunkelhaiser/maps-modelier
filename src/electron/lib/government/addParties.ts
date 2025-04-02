import { and, eq, inArray } from "drizzle-orm";
import { PartiesInput, partiesSchema } from "../../../shared/schemas/politics/addParties.js";
import { db } from "../../db/db.js";
import { parliamentSeats, parliaments } from "../../db/schema.js";
import { checkParliamentExistence } from "./checkParliamentExistence.js";

export const addParties = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number, data: PartiesInput) => {
    const parties = await partiesSchema.parseAsync(data);

    await db.transaction(async (tx) => {
        if (parties.length === 0) return;

        const parliament = await checkParliamentExistence(mapId, id, tx);

        const existingSeats = await tx
            .select()
            .from(parliamentSeats)
            .where(and(eq(parliamentSeats.mapId, mapId), eq(parliamentSeats.parliamentId, id)));

        const existingPartyIds = new Set(existingSeats.map((s) => s.partyId));
        const newPartyIds = new Set(parties.map((party) => party.partyId));

        const partyIdsToRemove = [...existingPartyIds].filter((partyId) => !newPartyIds.has(partyId));

        if (partyIdsToRemove.length > 0) {
            await tx
                .delete(parliamentSeats)
                .where(
                    and(
                        eq(parliamentSeats.mapId, mapId),
                        eq(parliamentSeats.parliamentId, id),
                        inArray(parliamentSeats.partyId, partyIdsToRemove)
                    )
                );
        }

        const totalSeats = parties.reduce((sum, party) => sum + party.seatsNumber, 0);
        if (totalSeats > parliament.seatsNumber) {
            throw new Error(
                `Total party seats (${totalSeats}) exceed parliament's total seats (${parliament.seatsNumber})`
            );
        }

        for (const party of parties) {
            if (existingPartyIds.has(party.partyId)) {
                await tx
                    .update(parliamentSeats)
                    .set({
                        seats: party.seatsNumber,
                        side: party.side,
                    })
                    .where(
                        and(
                            eq(parliamentSeats.mapId, mapId),
                            eq(parliamentSeats.parliamentId, id),
                            eq(parliamentSeats.partyId, party.partyId)
                        )
                    );
            } else {
                await tx.insert(parliamentSeats).values({
                    mapId,
                    parliamentId: id,
                    partyId: party.partyId,
                    seats: party.seatsNumber,
                    side: party.side,
                });
            }
        }

        await tx
            .update(parliaments)
            .set({
                updatedAt: new Date(),
            })
            .where(and(eq(parliaments.mapId, mapId), eq(parliaments.id, id)));
    });
};
