import { and, eq } from "drizzle-orm";
import { IpcMainInvokeEvent } from "electron";
import { GetPartiesInput, getPartiesSchema } from "../../../shared/schemas/parties/getParties.js";
import { db } from "../../db/db.js";
import { politicalParties, partyMembers, partyIdeologies, ideologies } from "../../db/schema.js";
import { orderBy } from "../utils/orderBy.js";

export const getAllParties = async (
    _event: IpcMainInvokeEvent,
    mapId: string,
    countryId: number,
    query?: GetPartiesInput
) => {
    const { sortBy, sortOrder } = await getPartiesSchema.parseAsync(query);

    let partiesQuery = db
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

    if (sortBy !== "ideology") {
        const sortOptions = {
            name: politicalParties.name,
            members: politicalParties.membersCount,
        };

        const orderQuery = orderBy(sortOptions[sortBy], sortOrder);
        // @ts-expect-error - wrong type inheritance
        partiesQuery = partiesQuery.orderBy(orderQuery);
    }

    const partiesArr = await partiesQuery;

    const partiesData = await Promise.all(
        partiesArr.map(async (party) => {
            const [primaryIdeology] = await db
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

            return {
                ...party,
                primaryIdeology,
            };
        })
    );

    if (sortBy === "ideology") {
        partiesData.sort((a, b) => {
            const ideologyA = a.primaryIdeology.name;
            const ideologyB = b.primaryIdeology.name;

            if (sortOrder === "asc") return ideologyA.localeCompare(ideologyB);
            return ideologyB.localeCompare(ideologyA);
        });
    }

    return partiesData;
};
