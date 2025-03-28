import { and, eq, inArray } from "drizzle-orm";
import { PoliticalParty } from "../../../shared/types.js";
import { db } from "../../db/db.js";
import { politicians, partyMembers, politicalParties } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getAllPoliticians = async (_: Electron.IpcMainInvokeEvent, mapId: string, countryId: number) => {
    const politiciansList = await db
        .select({
            id: politicians.id,
            name: politicians.name,
            portrait: politicians.portrait,
        })
        .from(politicians)
        .where(and(eq(politicians.mapId, mapId), eq(politicians.countryId, countryId)))
        .orderBy(politicians.name);

    const politicianIds = politiciansList.map((p) => p.id);

    const partyMemberships = await db
        .select({
            politicianId: partyMembers.politicianId,
            id: politicalParties.id,
            name: politicalParties.name,
            acronym: politicalParties.acronym,
            color: politicalParties.color,
        })
        .from(partyMembers)
        .innerJoin(
            politicalParties,
            and(eq(politicalParties.id, partyMembers.partyId), eq(politicalParties.mapId, partyMembers.mapId))
        )
        .where(and(eq(partyMembers.mapId, mapId), inArray(partyMembers.politicianId, politicianIds)));

    const politicianToPartyMap = new Map<number, PoliticalParty>();
    partyMemberships.forEach((membership) => {
        politicianToPartyMap.set(membership.politicianId, {
            id: membership.id,
            name: membership.name,
            acronym: membership.acronym,
            color: membership.color,
        });
    });

    const processedData = await Promise.all(
        politiciansList.map(async (politician) => {
            let portraitData: string | null = null;
            if (politician.portrait) portraitData = await loadFile(politician.portrait);

            return {
                id: politician.id,
                name: politician.name,
                portrait: portraitData,
                party: politicianToPartyMap.get(politician.id) ?? null,
            };
        })
    );

    return processedData;
};
