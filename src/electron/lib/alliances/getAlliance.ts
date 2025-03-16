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
                tag: countries.tag,
                name: countryNames.commonName,
                flag: countryFlags.path,
            },
            type: alliances.type,
            membersCount: count(allianceMembers.countryTag),
        })
        .from(alliances)
        .innerJoin(countries, and(eq(alliances.leader, countries.tag), eq(countries.mapId, mapId)))
        .leftJoin(countryNames, and(eq(countries.tag, countryNames.countryTag), eq(countryNames.mapId, mapId)))
        .leftJoin(countryFlags, and(eq(countries.tag, countryFlags.countryTag), eq(countryFlags.mapId, mapId)))
        .leftJoin(allianceMembers, and(eq(alliances.id, allianceMembers.allianceId), eq(allianceMembers.mapId, mapId)))
        .where(and(eq(alliances.mapId, mapId), eq(alliances.id, id)))
        .groupBy(alliances.id, countries.tag, countryNames.commonName, countryFlags.path);

    if (allianceArr.length === 0) throw new Error("Alliance not found");
    const [alliance] = allianceArr;

    const flag = await loadFile(alliance.leader.flag ?? "");
    alliance.leader.flag = flag;

    return alliance;
};
