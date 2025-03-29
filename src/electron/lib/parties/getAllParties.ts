import { and, eq } from "drizzle-orm";
import { IpcMainInvokeEvent } from "electron";
import { db } from "../../db/db.js";
import { politicalParties, partyMembers, partyIdeologies, ideologies } from "../../db/schema.js";

export const getAllParties = async (_event: IpcMainInvokeEvent, mapId: string, countryId: number) => {
    const partiesArr = await db
        .select({
            id: politicalParties.id,
            name: politicalParties.name,
            acronym: politicalParties.acronym,
            color: politicalParties.color,
            foundedAt: politicalParties.foundedAt,
            membersCount: politicalParties.membersCount,
        })
        .from(politicalParties)
        .leftJoin(partyMembers, and(eq(politicalParties.id, partyMembers.partyId), eq(partyMembers.mapId, mapId)))
        .where(and(eq(politicalParties.mapId, mapId), eq(politicalParties.countryId, countryId)))
        .groupBy(
            politicalParties.id,
            politicalParties.name,
            politicalParties.acronym,
            politicalParties.color,
            politicalParties.foundedAt
        );

    const partiesData = await Promise.all(
        partiesArr.map(async (party) => {
            const primaryIdeologies = await db
                .select({
                    id: ideologies.id,
                    name: ideologies.name,
                    color: ideologies.color,
                })
                .from(partyIdeologies)
                .innerJoin(ideologies, and(eq(partyIdeologies.ideologyId, ideologies.id), eq(ideologies.mapId, mapId)))
                .where(
                    and(
                        eq(partyIdeologies.partyId, party.id),
                        eq(partyIdeologies.mapId, mapId),
                        eq(partyIdeologies.isPrimary, true)
                    )
                );

            const primaryIdeology = primaryIdeologies.length > 0 ? primaryIdeologies[0] : null;

            return {
                ...party,
                primaryIdeology,
            };
        })
    );

    return partiesData;
};
