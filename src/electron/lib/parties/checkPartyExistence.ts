import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { politicalParties } from "../../db/schema.js";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0] | typeof db;

export const checkPartyExistence = async (mapId: string, id: number, dbInstance: Transaction = db) => {
    const party = await dbInstance
        .select()
        .from(politicalParties)
        .where(and(eq(politicalParties.mapId, mapId), eq(politicalParties.id, id)));

    if (party.length === 0) throw new Error("Party not found");

    return party[0];
};
