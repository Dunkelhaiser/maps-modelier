import { and, eq, sql } from "drizzle-orm";
import { db } from "../../db/db.js";
import {
    countries,
    countryStates,
    states,
    stateProvinces,
    provincePopulations,
    countryNames,
    countryFlags,
} from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getCountriesTable = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const countriesArr = await db
        .select({
            id: countries.id,
            name: countryNames.commonName,
            flag: countryFlags.path,
            population: sql<number>`
                COALESCE((
                    SELECT SUM(${provincePopulations.population})
                    FROM ${provincePopulations}
                    JOIN ${stateProvinces} ON ${stateProvinces.provinceId} = ${provincePopulations.provinceId}
                    JOIN ${states} ON ${states.id} = ${stateProvinces.stateId}
                    JOIN ${countryStates} ON ${countryStates.stateId} = ${states.id}
                    WHERE ${countryStates.countryId} = ${countries.id}
                    AND ${provincePopulations.mapId} = ${countries.mapId}
                ), 0)
            `.mapWith(Number),
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
