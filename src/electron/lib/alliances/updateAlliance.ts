import { and, count, eq } from "drizzle-orm";
import { AllianceInput, allianceSchema } from "../../../shared/schemas/alliances/alliance.js";
import { db } from "../../db/db.js";
import { alliances, allianceMembers } from "../../db/schema.js";
import { checkAllianceExistence } from "./checkAllianceExistence.js";

export const updateAlliance = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    id: number,
    data: AllianceInput
) => {
    const { leader } = await allianceSchema.parseAsync(data);

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

    await db
        .update(alliances)
        .set({
            ...data,
        })
        .where(and(eq(alliances.mapId, mapId), eq(alliances.id, id)));
};
