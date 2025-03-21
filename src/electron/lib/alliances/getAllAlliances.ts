import { and, count, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { alliances, allianceMembers, countries, countryNames, countryFlags } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getAllAlliances = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const alliancesArr = await db
        .select({
            id: alliances.id,
            name: alliances.name,
            leader: {
                id: countries.id,
                name: countryNames.commonName,
                flag: countryFlags.path,
            },
            type: alliances.type,
            membersCount: count(allianceMembers.countryId),
        })
        .from(alliances)
        .innerJoin(countries, and(eq(alliances.leader, countries.id), eq(countries.mapId, mapId)))
        .innerJoin(countryNames, and(eq(countries.id, countryNames.countryId), eq(countryNames.mapId, mapId)))
        .innerJoin(countryFlags, and(eq(countries.id, countryFlags.countryId), eq(countryFlags.mapId, mapId)))
        .innerJoin(allianceMembers, and(eq(alliances.id, allianceMembers.allianceId), eq(allianceMembers.mapId, mapId)))
        .where(eq(alliances.mapId, mapId))
        .groupBy(alliances.id, countries.id, countryNames.commonName, countryFlags.path);

    const alliancesWithLeaderFlags = await Promise.all(
        alliancesArr.map(async (alliance) => {
            const flag = await loadFile(alliance.leader.flag);
            alliance.leader.flag = flag;
            return alliance;
        })
    );

    return alliancesWithLeaderFlags;
};
