import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { headsOfGovernment, politicians, partyMembers, politicalParties } from "../../db/schema.js";
import { checkCountryExistence } from "../countries/checkCountryExistance.js";
import { loadFile } from "../utils/loadFile.js";

export const getHeadOfGovernment = async (_: Electron.IpcMainInvokeEvent, mapId: string, countryId: number) => {
    await checkCountryExistence(mapId, countryId);

    const headOfGovernmentArr = await db
        .select({
            politicianId: headsOfGovernment.politicianId,
            title: headsOfGovernment.title,
            startDate: headsOfGovernment.startDate,
            endDate: headsOfGovernment.endDate,
        })
        .from(headsOfGovernment)
        .where(and(eq(headsOfGovernment.mapId, mapId), eq(headsOfGovernment.countryId, countryId)));

    if (headOfGovernmentArr.length === 0) return null;

    const [headOfGovernmentData] = headOfGovernmentArr;

    const politicianArr = await db
        .select({
            id: politicians.id,
            name: politicians.name,
            portrait: politicians.portrait,
        })
        .from(politicians)
        .where(and(eq(politicians.mapId, mapId), eq(politicians.id, headOfGovernmentData.politicianId)));

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
        title: headOfGovernmentData.title,
        startDate: headOfGovernmentData.startDate,
        endDate: headOfGovernmentData.endDate,
    };
};
