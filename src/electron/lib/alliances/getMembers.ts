import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db.js";
import { allianceMembers, countries } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";
import { checkAllianceExistence } from "./checkAllianceExistence.js";

export const getMembers = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    const members = await db.transaction(async (tx) => {
        await checkAllianceExistence(mapId, id, tx);

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
