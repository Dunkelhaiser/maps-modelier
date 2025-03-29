import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db.js";
import { politicians, partyMembers } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";
import { checkPartyExistence } from "./checkPartyExistence.js";

export const getMembers = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    const members = await db.transaction(async (tx) => {
        await checkPartyExistence(mapId, id, tx);

        const membersArr = await tx
            .select()
            .from(partyMembers)
            .where(and(eq(partyMembers.mapId, mapId), eq(partyMembers.partyId, id)));

        const memberIds = membersArr.map((member) => member.partyId);

        const membersData = await tx
            .select({
                id: politicians.id,
                name: politicians.name,
                portrait: politicians.portrait,
            })
            .from(politicians)
            .where(and(eq(politicians.mapId, mapId), inArray(politicians.id, memberIds)))
            .orderBy(politicians.name);

        const loadedMembers = await Promise.all(
            membersData.map(async (member) => ({
                ...member,
                portrait: member.portrait ? await loadFile(member.portrait) : null,
            }))
        );

        return loadedMembers;
    });

    return members;
};
