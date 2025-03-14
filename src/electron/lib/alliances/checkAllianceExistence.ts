import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { alliances } from "../../db/schema.js";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0] | typeof db;

export const checkAllianceExistence = async (mapId: string, id: number, dbInstance: Transaction = db) => {
    const alliance = await dbInstance
        .select()
        .from(alliances)
        .where(and(eq(alliances.mapId, mapId), eq(alliances.id, id)));

    if (alliance.length === 0) throw new Error("Alliance not found");

    return alliance[0];
};
