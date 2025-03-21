import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countries, countryNames, countryFlags } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getCountriesBase = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const countriesArr = await db
        .select({
            id: countries.id,
            name: countryNames.commonName,
            flag: countryFlags.path,
        })
        .from(countries)
        .innerJoin(countryNames, and(eq(countryNames.countryId, countries.id), eq(countryNames.mapId, countries.mapId)))
        .innerJoin(countryFlags, and(eq(countryFlags.countryId, countries.id), eq(countryFlags.mapId, countries.mapId)))
        .where(eq(countries.mapId, mapId))
        .groupBy(countries.id)
        .orderBy(countryNames.commonName);

    const loadedCountries = await Promise.all(
        countriesArr.map(async (country) => ({
            ...country,
            flag: await loadFile(country.flag),
        }))
    );

    return loadedCountries;
};
