import { and, count, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { alliances, allianceMembers, countries } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getAllAlliances = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const alliancesArr = await db
        .select({
            id: alliances.id,
            name: alliances.name,
            leader: {
                tag: countries.tag,
                name: countries.name,
                color: countries.color,
                flag: countries.flag,
            },
            type: alliances.type,
            membersCount: count(allianceMembers.countryTag),
        })
        .from(alliances)
        .innerJoin(countries, and(eq(alliances.leader, countries.tag), eq(countries.mapId, mapId)))
        .leftJoin(allianceMembers, and(eq(alliances.id, allianceMembers.allianceId), eq(allianceMembers.mapId, mapId)))
        .where(eq(alliances.mapId, mapId))
        .groupBy(alliances.id);

    const alliancesWithLeaderFlags = await Promise.all(
        alliancesArr.map(async (alliance) => {
            const flag = await loadFile(alliance.leader.flag);
            alliance.leader.flag = flag;
            return alliance;
        })
    );

    return alliancesWithLeaderFlags;
};
