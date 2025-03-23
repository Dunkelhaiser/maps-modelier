import { getTableColumns } from "drizzle-orm";
import { AllianceInput, allianceSchema } from "../../../shared/schemas/alliances/alliance.js";
import { db } from "../../db/db.js";
import { alliances, allianceMembers } from "../../db/schema.js";
import { getCountryBase } from "../countries/getCountryBase.js";

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

    const leaderData = await getCountryBase(mapId, leader);

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
