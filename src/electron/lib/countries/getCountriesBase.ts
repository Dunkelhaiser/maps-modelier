import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countries, countryNames, countryFlags } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getCountriesBase = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const countriesArr = await db
        .select({
            tag: countries.tag,
            name: countryNames.commonName,
            flag: countryFlags.path,
        })
        .from(countries)
        .innerJoin(
            countryNames,
            and(eq(countryNames.countryTag, countries.tag), eq(countryNames.mapId, countries.mapId))
        )
        .innerJoin(
            countryFlags,
            and(eq(countryFlags.countryTag, countries.tag), eq(countryFlags.mapId, countries.mapId))
        )
        .where(eq(countries.mapId, mapId))
        .groupBy(countries.tag)
        .orderBy(countries.tag);

    const loadedCountries = await Promise.all(
        countriesArr.map(async (country) => ({
            ...country,
            flag: await loadFile(country.flag),
        }))
    );

    return loadedCountries;
};
