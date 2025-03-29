import { and, eq, inArray } from "drizzle-orm";
import { PartyInput, partySchema } from "../../../shared/schemas/parties/party.js";
import { db } from "../../db/db.js";
import { politicalParties, partyMembers, partyIdeologies } from "../../db/schema.js";
import { checkPartyExistence } from "./checkPartyExistence.js";

export const updateParty = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number, data: PartyInput) => {
    const { leader, ideologies } = await partySchema.parseAsync(data);

    return await db.transaction(async (tx) => {
        await checkPartyExistence(mapId, id, tx);

        const leaderExists = await tx
            .select({
                id: partyMembers.politicianId,
            })
            .from(partyMembers)
            .where(
                and(eq(partyMembers.mapId, mapId), eq(partyMembers.partyId, id), eq(partyMembers.politicianId, leader))
            );

        if (leaderExists.length === 0) throw new Error("New leader must be part of a party");

        const existingIdeologies = await tx
            .select()
            .from(partyIdeologies)
            .where(and(eq(partyIdeologies.mapId, mapId), eq(partyIdeologies.partyId, id)));

        const existingIdeologyIds = new Set(existingIdeologies.map((i) => i.ideologyId));
        const newIdeologyIds = new Set(ideologies.map((i) => i.ideologyId));

        const ideologyIdsToRemove = [...existingIdeologyIds].filter((ideologyId) => !newIdeologyIds.has(ideologyId));

        if (ideologyIdsToRemove.length > 0) {
            await tx
                .delete(partyIdeologies)
                .where(
                    and(
                        eq(partyIdeologies.mapId, mapId),
                        eq(partyIdeologies.partyId, id),
                        inArray(partyIdeologies.ideologyId, ideologyIdsToRemove)
                    )
                );
        }

        const ideologiesToUpdate = ideologies.filter((ideology) => {
            const existingIdeology = existingIdeologies.find((i) => i.ideologyId === ideology.ideologyId);
            return existingIdeology && existingIdeology.isPrimary !== ideology.isPrimary;
        });

        for (const ideology of ideologiesToUpdate) {
            await tx
                .update(partyIdeologies)
                .set({
                    isPrimary: ideology.isPrimary,
                })
                .where(
                    and(
                        eq(partyIdeologies.mapId, mapId),
                        eq(partyIdeologies.partyId, id),
                        eq(partyIdeologies.ideologyId, ideology.ideologyId)
                    )
                );
        }

        const ideologiesToInsert = ideologies.filter((ideology) => !existingIdeologyIds.has(ideology.ideologyId));

        if (ideologiesToInsert.length > 0) {
            await tx.insert(partyIdeologies).values(
                ideologiesToInsert.map((ideology) => ({
                    mapId,
                    partyId: id,
                    ideologyId: ideology.ideologyId,
                    isPrimary: ideology.isPrimary,
                }))
            );
        }

        const [updatedParty] = await tx
            .update(politicalParties)
            .set({
                leaderId: leader,
                ...data,
            })
            .where(and(eq(politicalParties.mapId, mapId), eq(politicalParties.id, id)))
            .returning({ id: politicalParties.id });

        return {
            id: updatedParty.id,
        };
    });
};
