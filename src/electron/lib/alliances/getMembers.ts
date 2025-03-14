import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db.js";
import { alliances, allianceMembers, countries } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getMembers = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    const members = await db.transaction(async (tx) => {
        const alliance = await tx
            .select()
            .from(alliances)
            .where(and(eq(alliances.mapId, mapId), eq(alliances.id, id)));

        if (alliance.length === 0) throw new Error("Alliance not found");

        const membersArr = await tx
            .select()
            .from(allianceMembers)
            .where(and(eq(allianceMembers.mapId, mapId), eq(allianceMembers.allianceId, id)));

        const membersData = await tx
            .select({
                tag: countries.tag,
                name: countries.name,
                flag: countries.flag,
            })
            .from(countries)
            .where(
                inArray(
                    countries.tag,
                    membersArr.map((member) => member.countryTag)
                )
            );

        membersData.forEach(async (member) => (member.flag = await loadFile(member.flag)));

        return membersData;
    });

    return members;
};
