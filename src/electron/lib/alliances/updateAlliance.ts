import { and, count, eq, getTableColumns } from "drizzle-orm";
import { AllianceInput, allianceSchema } from "../../../shared/schemas/alliances/alliance.js";
import { db } from "../../db/db.js";
import { alliances, countries, allianceMembers, countryNames, countryFlags } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";
import { checkAllianceExistence } from "./checkAllianceExistence.js";

export const updateAlliance = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    id: number,
    data: AllianceInput
) => {
    const { leader } = await allianceSchema.parseAsync(data);
    const { mapId: mapIdCol, createdAt, updatedAt, ...cols } = getTableColumns(alliances);

    await checkAllianceExistence(mapId, id);

    const leaderExists = await db
        .select({
            count: count(allianceMembers.countryId),
        })
        .from(allianceMembers)
        .where(
            and(
                eq(allianceMembers.mapId, mapId),
                eq(allianceMembers.allianceId, id),
                eq(allianceMembers.countryId, leader)
            )
        );

    if (leaderExists.length === 0) throw new Error("New leader must be part of alliance");

    const [updatedAlliance] = await db
        .update(alliances)
        .set({
            ...data,
        })
        .where(and(eq(alliances.mapId, mapId), eq(alliances.id, id)))
        .returning(cols);

    const [leaderData] = await db
        .select({
            id: countries.id,
            name: countryNames.commonName,
            flag: countryFlags.path,
        })
        .from(countries)
        .innerJoin(countryNames, and(eq(countryNames.countryId, countries.id), eq(countryNames.mapId, countries.mapId)))
        .innerJoin(countryFlags, and(eq(countryFlags.countryId, countries.id), eq(countryFlags.mapId, countries.mapId)))
        .where(and(eq(countries.mapId, mapId), eq(countries.id, leader)));

    const flag = await loadFile(leaderData.flag);
    leaderData.flag = flag;

    const [membersCount] = await db
        .select({
            count: count(allianceMembers.countryId),
        })
        .from(allianceMembers)
        .where(and(eq(allianceMembers.mapId, mapId), eq(allianceMembers.allianceId, id)));

    return { ...updatedAlliance, leader: leaderData, membersCount: membersCount.count };
};
