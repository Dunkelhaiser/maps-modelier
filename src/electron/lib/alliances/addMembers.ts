import { and, eq, inArray } from "drizzle-orm";
import { AddMembersInput, addMembersSchema } from "../../../shared/schemas/alliances/addMembers.js";
import { db } from "../../db/db.js";
import { allianceMembers } from "../../db/schema.js";
import { checkAllianceExistence } from "./checkAllianceExistence.js";

export const addMembers = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number, data: AddMembersInput) => {
    const members = await addMembersSchema.parseAsync(data);

    await db.transaction(async (tx) => {
        if (members.length === 0) return;

        const alliance = await checkAllianceExistence(mapId, id, tx);

        const existingMembers = await tx
            .select()
            .from(allianceMembers)
            .where(and(eq(allianceMembers.mapId, mapId), eq(allianceMembers.allianceId, id)));

        const existingMembersIds = new Set(existingMembers.map((m) => m.countryId));
        const newMembersIds = new Set(members);
        const membersIdsToRemove = [...existingMembersIds].filter((countryId) => !newMembersIds.has(countryId));

        if (membersIdsToRemove.length > 0) {
            if (alliance.leader && membersIdsToRemove.includes(alliance.leader)) {
                throw new Error("Cannot remove alliance leader");
            }

            await tx
                .delete(allianceMembers)
                .where(
                    and(
                        eq(allianceMembers.mapId, mapId),
                        eq(allianceMembers.allianceId, id),
                        inArray(allianceMembers.countryId, membersIdsToRemove)
                    )
                );
        }

        await tx
            .insert(allianceMembers)
            .values(members.map((countryId) => ({ mapId, allianceId: id, countryId })))
            .onConflictDoNothing();
    });
};
