import { and, count, eq, getTableColumns } from "drizzle-orm";
import { AllianceInput, allianceSchema } from "../../../shared/schemas/alliances/alliance.js";
import { db } from "../../db/db.js";
import { alliances, allianceMembers } from "../../db/schema.js";
import { getCountryBase } from "../countries/getCountryBase.js";
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

    const leaderData = await getCountryBase(mapId, leader);

    const [membersCount] = await db
        .select({
            count: count(allianceMembers.countryId),
        })
        .from(allianceMembers)
        .where(and(eq(allianceMembers.mapId, mapId), eq(allianceMembers.allianceId, id)));

    return { ...updatedAlliance, leader: leaderData, membersCount: membersCount.count };
};
