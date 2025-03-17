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
                tag: countries.tag,
                name: countryNames.commonName,
                flag: countryFlags.path,
            },
            type: alliances.type,
            membersCount: count(allianceMembers.countryTag),
        })
        .from(alliances)
        .innerJoin(countries, and(eq(alliances.leader, countries.tag), eq(countries.mapId, mapId)))
        .innerJoin(countryNames, and(eq(countries.tag, countryNames.countryTag), eq(countryNames.mapId, mapId)))
        .innerJoin(countryFlags, and(eq(countries.tag, countryFlags.countryTag), eq(countryFlags.mapId, mapId)))
        .innerJoin(allianceMembers, and(eq(alliances.id, allianceMembers.allianceId), eq(allianceMembers.mapId, mapId)))
        .where(eq(alliances.mapId, mapId))
        .groupBy(alliances.id, countries.tag, countryNames.commonName, countryFlags.path);

    const alliancesWithLeaderFlags = await Promise.all(
        alliancesArr.map(async (alliance) => {
            const flag = await loadFile(alliance.leader.flag);
            alliance.leader.flag = flag;
            return alliance;
        })
    );

    return alliancesWithLeaderFlags;
};
