import { and, count, eq, getTableColumns } from "drizzle-orm";
import { AllianceInput, allianceSchema } from "../../../shared/schemas/alliances/alliance.js";
import { db } from "../../db/db.js";
import { alliances, countries, allianceMembers } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const updateAlliance = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    id: number,
    data: AllianceInput
) => {
    const { leader } = await allianceSchema.parseAsync(data);
    const { mapId: mapIdCol, createdAt, updatedAt, ...cols } = getTableColumns(alliances);

    const [updatedAlliance] = await db
        .update(alliances)
        .set({
            ...data,
        })
        .where(and(eq(alliances.mapId, mapId), eq(alliances.id, id)))
        .returning(cols);

    const [leaderData] = await db
        .select({
            tag: countries.tag,
            name: countries.name,
            flag: countries.flag,
        })
        .from(countries)
        .where(and(eq(countries.mapId, mapId), eq(countries.tag, leader)));

    const flag = await loadFile(leaderData.flag);

    leaderData.flag = flag;

    const [membersCount] = await db
        .select({
            count: count(allianceMembers.countryTag),
        })
        .from(allianceMembers)
        .where(and(eq(allianceMembers.mapId, mapId), eq(allianceMembers.allianceId, id)));

    return { ...updatedAlliance, leader: leaderData, membersCount: membersCount.count };
};
