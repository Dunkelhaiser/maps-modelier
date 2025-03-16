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
            tag: countries.tag,
            name: countryNames.commonName,
            flag: countryFlags.path,
        })
        .from(countries)
        .leftJoin(
            countryNames,
            and(eq(countryNames.countryTag, countries.tag), eq(countryNames.mapId, countries.mapId))
        )
        .leftJoin(
            countryFlags,
            and(eq(countryFlags.countryTag, countries.tag), eq(countryFlags.mapId, countries.mapId))
        )
        .where(and(eq(countries.mapId, mapId), eq(countries.tag, leader)));

    const flag = await loadFile(leaderData.flag ?? "");

    leaderData.flag = flag;

    await db.insert(allianceMembers).values({
        mapId,
        allianceId: createdAlliance.id,
        countryTag: leader,
    });

    return {
        ...createdAlliance,
        leader: {
            name: leaderData.name!,
            tag: leaderData.tag,
            flag: leaderData.flag,
        },
        membersCount: 1,
    };
};
