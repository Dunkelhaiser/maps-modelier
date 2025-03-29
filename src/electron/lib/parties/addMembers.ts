import { and, eq, inArray } from "drizzle-orm";
import { AddMembersInput, addMembersSchema } from "../../../shared/schemas/parties/addMembers.js";
import { db } from "../../db/db.js";
import { partyMembers, politicalParties } from "../../db/schema.js";
import { checkPartyExistence } from "./checkPartyExistence.js";

export const addMembers = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number, data: AddMembersInput) => {
    const members = await addMembersSchema.parseAsync(data);

    await db.transaction(async (tx) => {
        if (members.length === 0) return;

        const party = await checkPartyExistence(mapId, id, tx);

        const existingMembers = await tx
            .select()
            .from(partyMembers)
            .where(and(eq(partyMembers.mapId, mapId), eq(partyMembers.partyId, id)));

        const existingMembersIds = new Set(existingMembers.map((m) => m.politicianId));
        const newMembersIds = new Set(members);
        const membersIdsToRemove = [...existingMembersIds].filter((politicianId) => !newMembersIds.has(politicianId));

        if (membersIdsToRemove.length > 0) {
            if (membersIdsToRemove.includes(party.leaderId)) throw new Error("Cannot remove party leader");

            await tx
                .delete(partyMembers)
                .where(
                    and(
                        eq(partyMembers.mapId, mapId),
                        eq(partyMembers.partyId, id),
                        inArray(partyMembers.politicianId, membersIdsToRemove)
                    )
                );
        }

        await tx
            .insert(partyMembers)
            .values(
                members.map((politicianId) => ({
                    mapId,
                    partyId: id,
                    politicianId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }))
            )
            .onConflictDoNothing();

        const totalMembersCount =
            existingMembersIds.size -
            membersIdsToRemove.length +
            members.filter((memberId) => !existingMembersIds.has(memberId)).length;

        if (totalMembersCount > party.membersCount) {
            await tx
                .update(politicalParties)
                .set({
                    membersCount: totalMembersCount,
                    updatedAt: new Date(),
                })
                .where(and(eq(politicalParties.mapId, mapId), eq(politicalParties.id, id)));
        }
    });
};
