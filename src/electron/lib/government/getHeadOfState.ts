import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { headsOfState, politicians, partyMembers, politicalParties } from "../../db/schema.js";
import { checkCountryExistence } from "../countries/checkCountryExistance.js";
import { loadFile } from "../utils/loadFile.js";

export const getHeadOfState = async (_: Electron.IpcMainInvokeEvent, mapId: string, countryId: number) => {
    await checkCountryExistence(mapId, countryId);

    const headOfStateArr = await db
        .select({
            politicianId: headsOfState.politicianId,
            title: headsOfState.title,
            startDate: headsOfState.startDate,
            endDate: headsOfState.endDate,
        })
        .from(headsOfState)
        .where(and(eq(headsOfState.mapId, mapId), eq(headsOfState.countryId, countryId)));

    if (headOfStateArr.length === 0) return null;

    const [headOfStateData] = headOfStateArr;

    const politicianArr = await db
        .select({
            id: politicians.id,
            name: politicians.name,
            portrait: politicians.portrait,
        })
        .from(politicians)
        .where(and(eq(politicians.mapId, mapId), eq(politicians.id, headOfStateData.politicianId)));

    if (politicianArr.length === 0) return null;

    const [politicianData] = politicianArr;

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
        .where(and(eq(partyMembers.mapId, mapId), eq(partyMembers.politicianId, politicianData.id)));

    let portraitData: string | null = null;
    if (politicianData.portrait) portraitData = await loadFile(politicianData.portrait);

    return {
        id: politicianData.id,
        name: politicianData.name,
        portrait: portraitData,
        party: partyMembership.length > 0 ? partyMembership[0] : null,
        title: headOfStateData.title,
        startDate: headOfStateData.startDate,
        endDate: headOfStateData.endDate,
    };
};
