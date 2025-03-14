import { and, eq, inArray } from "drizzle-orm";
import { AddMembersInput, addMembersSchema } from "../../../shared/schemas/alliances/addMembers.js";
import { db } from "../../db/db.js";
import { alliances, allianceMembers } from "../../db/schema.js";

export const addMembers = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number, data: AddMembersInput) => {
    const members = await addMembersSchema.parseAsync(data);

    await db.transaction(async (tx) => {
        if (members.length === 0) return;

        const alliance = await tx
            .select()
            .from(alliances)
            .where(and(eq(alliances.mapId, mapId), eq(alliances.id, id)));

        if (alliance.length === 0) throw new Error("Alliance not found");

        const existingMembers = await tx
            .select()
            .from(allianceMembers)
            .where(and(eq(allianceMembers.mapId, mapId), eq(allianceMembers.allianceId, id)));

        const existingMembersTags = new Set(existingMembers.map((m) => m.countryTag));
        const newMembersTags = new Set(members);
        const membersIdsToRemove = [...existingMembersTags].filter((tag) => !newMembersTags.has(tag));

        if (membersIdsToRemove.length > 0) {
            await tx
                .delete(allianceMembers)
                .where(
                    and(
                        eq(allianceMembers.mapId, mapId),
                        eq(allianceMembers.allianceId, id),
                        inArray(allianceMembers.countryTag, membersIdsToRemove)
                    )
                );
        }

        await tx
            .insert(allianceMembers)
            .values(members.map((tag) => ({ mapId, allianceId: id, countryTag: tag })))
            .onConflictDoNothing();
    });
};
