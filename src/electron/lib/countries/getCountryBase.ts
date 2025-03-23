import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countries, countryNames, countryFlags } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getCountryBase = async (mapId: string, id: number) => {
    const country = await db
        .select({
            id: countries.id,
            name: countryNames.commonName,
            flag: countryFlags.path,
        })
        .from(countries)
        .innerJoin(countryNames, and(eq(countries.id, countryNames.countryId), eq(countries.mapId, countryNames.mapId)))
        .innerJoin(countryFlags, and(eq(countries.id, countryFlags.countryId), eq(countries.mapId, countryFlags.mapId)))
        .where(and(eq(countries.id, id), eq(countries.mapId, mapId)));

    if (country.length === 0) throw new Error(`Country does not exist`);

    const [countryData] = country;
    const flag = await loadFile(countryData.flag);

    return {
        ...countryData,
        flag,
    };
};
