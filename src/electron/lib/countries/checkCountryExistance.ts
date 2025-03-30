import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countries } from "../../db/schema.js";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0] | typeof db;

export const checkCountryExistence = async (mapId: string, id: number, dbInstance: Transaction = db) => {
    const country = await dbInstance
        .select()
        .from(countries)
        .where(and(eq(countries.mapId, mapId), eq(countries.id, id)));

    if (country.length === 0) throw new Error("Country does not exist");

    return country[0];
};
