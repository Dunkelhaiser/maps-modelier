import { and, eq, getTableColumns } from "drizzle-orm";
import { AllianceInput, allianceSchema } from "../../../shared/schemas/alliances/alliance.js";
import { db } from "../../db/db.js";
import { alliances, countries, allianceMembers } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const createAlliance = async (_: Electron.IpcMainInvokeEvent, mapId: string, data: AllianceInput) => {
    const { leader } = await allianceSchema.parseAsync(data);
    const { mapId: mapIdCol, createdAt, updatedAt, ...cols } = getTableColumns(alliances);

    const [createdAlliance] = await db
        .insert(alliances)
        .values({
            mapId,
            ...data,
        })
        .returning(cols);

    const [leaderData] = await db
        .select()
        .from(countries)
        .where(and(eq(countries.mapId, mapId), eq(countries.tag, leader)));

    const flag = await loadFile(leaderData.flag);

    leaderData.flag = flag;

    await db.insert(allianceMembers).values({
        mapId,
        allianceId: createdAlliance.id,
        countryTag: leader,
    });

    return { ...createdAlliance, leader: leaderData, membersCount: 1 };
};
