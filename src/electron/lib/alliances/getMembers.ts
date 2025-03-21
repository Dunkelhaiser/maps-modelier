import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db.js";
import { allianceMembers, countries, countryNames, countryFlags } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";
import { checkAllianceExistence } from "./checkAllianceExistence.js";

export const getMembers = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    const members = await db.transaction(async (tx) => {
        await checkAllianceExistence(mapId, id, tx);

        const membersArr = await tx
            .select()
            .from(allianceMembers)
            .where(and(eq(allianceMembers.mapId, mapId), eq(allianceMembers.allianceId, id)));

        const memberIds = membersArr.map((member) => member.countryId);

        const membersData = await tx
            .select({
                id: countries.id,
                name: countryNames.commonName,
                flag: countryFlags.path,
            })
            .from(countries)
            .innerJoin(
                countryNames,
                and(eq(countryNames.countryId, countries.id), eq(countryNames.mapId, countries.mapId))
            )
            .innerJoin(
                countryFlags,
                and(eq(countryFlags.countryId, countries.id), eq(countryFlags.mapId, countries.mapId))
            )
            .where(and(eq(countries.mapId, mapId), inArray(countries.id, memberIds)));

        const loadedMembers = await Promise.all(
            membersData.map(async (member) => ({
                ...member,
                flag: await loadFile(member.flag),
            }))
        );

        return loadedMembers;
    });

    return members;
};
