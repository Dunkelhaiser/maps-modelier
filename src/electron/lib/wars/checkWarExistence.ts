import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { wars } from "../../db/schema.js";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0] | typeof db;

export const checkWarExistence = async (mapId: string, id: number, dbInstance: Transaction = db) => {
    const war = await dbInstance
        .select()
        .from(wars)
        .where(and(eq(wars.mapId, mapId), eq(wars.id, id)));

    if (war.length === 0) throw new Error("War not found");

    return war[0];
};
