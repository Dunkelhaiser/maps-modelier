import { and, eq, getTableColumns } from "drizzle-orm";
import { AllianceInput, allianceSchema } from "../../../shared/schemas/alliances/alliance.js";
import { db } from "../../db/db.js";
import { alliances, countries, allianceMembers, countryNames, countryFlags } from "../../db/schema.js";
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

    await db.insert(allianceMembers).values({
        mapId,
        allianceId: createdAlliance.id,
        countryId: leader,
    });

    return {
        ...createdAlliance,
        leader: {
            id: leaderData.id,
            name: leaderData.name,
            flag: leaderData.flag,
        },
        membersCount: 1,
    };
};
