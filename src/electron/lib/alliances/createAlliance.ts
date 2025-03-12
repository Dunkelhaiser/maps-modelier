import { and, eq, getTableColumns } from "drizzle-orm";
import { CreateAllianceInput, createAllianceSchema } from "../../../shared/schemas/alliances/createAlliance.js";
import { CountryBase } from "../../../shared/types.js";
import { db } from "../../db/db.js";
import { alliances, countries, allianceMembers } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const createAlliance = async (_: Electron.IpcMainInvokeEvent, mapId: string, data: CreateAllianceInput) => {
    const { leader } = await createAllianceSchema.parseAsync(data);
    const { mapId: mapIdCol, createdAt, updatedAt, ...cols } = getTableColumns(alliances);

    const [createdAlliance] = await db
        .insert(alliances)
        .values({
            mapId,
            ...data,
        })
        .returning(cols);

    let leaderData: CountryBase | null = null;
    if (leader) {
        [leaderData] = await db
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
    }

    return { ...createdAlliance, leader: leaderData };
};
