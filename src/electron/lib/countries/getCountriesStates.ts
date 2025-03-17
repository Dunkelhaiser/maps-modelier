import { eq, sql } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countries, countryStates } from "../../db/schema.js";

export const getCountriesStates = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const countriesArr = await db
        .select({
            tag: countries.tag,
            color: countries.color,
            states: sql<string>`COALESCE(GROUP_CONCAT(${countryStates.stateId}), '')`,
        })
        .from(countries)
        .leftJoin(countryStates, eq(countryStates.countryTag, countries.tag))
        .where(eq(countries.mapId, mapId))
        .groupBy(countries.tag)
        .orderBy(countries.tag);

    return countriesArr.map((country) => ({
        ...country,
        states: country.states ? country.states.split(",").map(Number) : [],
    }));
};
