import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { parliaments } from "../../db/schema.js";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0] | typeof db;

export const checkParliamentExistence = async (mapId: string, id: number, dbInstance: Transaction = db) => {
    const parliament = await dbInstance
        .select()
        .from(parliaments)
        .where(and(eq(parliaments.mapId, mapId), eq(parliaments.id, id)));

    if (parliament.length === 0) throw new Error("Parliament does not exist");

    return parliament[0];
};
