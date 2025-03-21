import { and, count, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { alliances, allianceMembers, countries, countryNames, countryFlags } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getAlliance = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    const allianceArr = await db
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
        .where(and(eq(alliances.mapId, mapId), eq(alliances.id, id)))
        .groupBy(alliances.id, countries.id, countryNames.commonName, countryFlags.path);

    if (allianceArr.length === 0) throw new Error("Alliance not found");
    const [alliance] = allianceArr;

    const flag = await loadFile(alliance.leader.flag);
    alliance.leader.flag = flag;

    return alliance;
};
