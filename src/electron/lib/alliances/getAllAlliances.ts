import { eq, sum } from "drizzle-orm";
import { db } from "../../db/db.js";
import { alliances, allianceMembers, countries } from "../../db/schema.js";

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
            membersCount: sum(allianceMembers.countryTag).mapWith(Number),
        })
        .from(alliances)
        .innerJoin(allianceMembers, eq(alliances.id, allianceMembers.allianceId))
        .innerJoin(countries, eq(alliances.leader, countries.tag))
        .where(eq(alliances.mapId, mapId));

    return alliancesArr;
};
