import { AllianceInput, allianceSchema } from "../../../shared/schemas/alliances/alliance.js";
import { db } from "../../db/db.js";
import { alliances, allianceMembers } from "../../db/schema.js";

export const createAlliance = async (_: Electron.IpcMainInvokeEvent, mapId: string, data: AllianceInput) => {
    const { leader } = await allianceSchema.parseAsync(data);

    const [createdAlliance] = await db
        .insert(alliances)
        .values({
            mapId,
            ...data,
        })
        .returning({ id: alliances.id });

    await db.insert(allianceMembers).values({
        mapId,
        allianceId: createdAlliance.id,
        countryId: leader,
    });

    return createdAlliance;
};
