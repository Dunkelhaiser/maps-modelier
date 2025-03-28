import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { politicians, partyMembers, politicalParties } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getPolitician = async (_: Electron.IpcMainInvokeEvent, mapId: string, politicianId: number) => {
    const politician = await db
        .select({
            id: politicians.id,
            name: politicians.name,
            portrait: politicians.portrait,
        })
        .from(politicians)
        .where(and(eq(politicians.mapId, mapId), eq(politicians.id, politicianId)));

    if (politician.length === 0) throw new Error(`Politician not found`);

    const [politicianData] = politician;

    const partyMembership = await db
        .select({
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
        .where(and(eq(partyMembers.mapId, mapId), eq(partyMembers.politicianId, politicianId)));

    let portraitData: string | null = null;
    if (politicianData.portrait) portraitData = await loadFile(politicianData.portrait);

    return {
        id: politicianData.id,
        name: politicianData.name,
        portrait: portraitData,
        party: partyMembership.length > 0 ? partyMembership[0] : null,
    };
};
