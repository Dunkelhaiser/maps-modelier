import { and, eq } from "drizzle-orm";
import { IpcMainInvokeEvent } from "electron";
import { db } from "../../db/db.js";
import { politicalParties, politicians, partyIdeologies, ideologies } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getParty = async (_event: IpcMainInvokeEvent, mapId: string, partyId: number) => {
    const party = await db
        .select({
            id: politicalParties.id,
            name: politicalParties.name,
            acronym: politicalParties.acronym,
            color: politicalParties.color,
            leaderId: politicalParties.leaderId,
            membersCount: politicalParties.membersCount,
            foundedAt: politicalParties.foundedAt,
        })
        .from(politicalParties)
        .where(and(eq(politicalParties.mapId, mapId), eq(politicalParties.id, partyId)))
        .limit(1);

    if (party.length === 0) throw new Error("Party not found");

    const [partyData] = party;

    const [leader] = await db
        .select({
            id: politicians.id,
            name: politicians.name,
            portrait: politicians.portrait,
        })
        .from(politicians)
        .where(and(eq(politicians.mapId, mapId), eq(politicians.id, partyData.leaderId)));

    let portrait: string | null = null;
    if (leader.portrait) portrait = await loadFile(leader.portrait);

    const partyIdeologiesArr = await db
        .select({
            id: ideologies.id,
            name: ideologies.name,
            color: ideologies.color,
        })
        .from(partyIdeologies)
        .innerJoin(
            ideologies,
            and(
                eq(partyIdeologies.ideologyId, ideologies.id),
                eq(ideologies.mapId, mapId),
                eq(partyIdeologies.isPrimary, false)
            )
        )
        .where(and(eq(partyIdeologies.partyId, partyId), eq(partyIdeologies.mapId, mapId)));

    const [primaryIdeology] = await db
        .select({
            id: ideologies.id,
            name: ideologies.name,
            color: ideologies.color,
        })
        .from(partyIdeologies)
        .innerJoin(
            ideologies,
            and(
                eq(partyIdeologies.ideologyId, ideologies.id),
                eq(ideologies.mapId, mapId),
                eq(partyIdeologies.isPrimary, true)
            )
        )
        .where(and(eq(partyIdeologies.partyId, partyId), eq(partyIdeologies.mapId, mapId)));

    return {
        id: partyData.id,
        name: partyData.name,
        acronym: partyData.acronym,
        color: partyData.color,
        foundedAt: partyData.foundedAt,
        membersCount: partyData.membersCount,
        leader: {
            ...leader,
            portrait,
        },
        primaryIdeology,
        ideologies: partyIdeologiesArr,
    };
};
