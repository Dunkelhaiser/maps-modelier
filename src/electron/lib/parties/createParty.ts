import { PartyInput, partySchema } from "../../../shared/schemas/parties/party.js";
import { db } from "../../db/db.js";
import { politicalParties, partyMembers, partyIdeologies } from "../../db/schema.js";

export const createParty = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    countryId: number,
    data: PartyInput
) => {
    const { leader } = await partySchema.parseAsync(data);

    return await db.transaction(async (tx) => {
        const [createdParty] = await tx
            .insert(politicalParties)
            .values({
                mapId,
                countryId,
                leaderId: leader,
                ...data,
                acronym: data.acronym?.length ? data.acronym : null,
            })
            .returning({ id: politicalParties.id });

        await tx.insert(partyMembers).values({
            mapId,
            partyId: createdParty.id,
            politicianId: leader,
        });

        await tx
            .insert(partyIdeologies)
            .values(data.ideologies.map((ideology) => ({ ...ideology, partyId: createdParty.id, mapId })));

        return createdParty;
    });
};
