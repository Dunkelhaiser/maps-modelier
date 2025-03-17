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
            tag: countries.tag,
            name: countryNames.commonName,
            flag: countryFlags.path,
            population: sql<number>`
                COALESCE((
                    SELECT SUM(${provincePopulations.population})
                    FROM ${provincePopulations}
                    JOIN ${stateProvinces} ON ${stateProvinces.provinceId} = ${provincePopulations.provinceId}
                    JOIN ${states} ON ${states.id} = ${stateProvinces.stateId}
                    JOIN ${countryStates} ON ${countryStates.stateId} = ${states.id}
                    WHERE ${countryStates.countryTag} = ${countries.tag}
                    AND ${provincePopulations.mapId} = ${countries.mapId}
                ), 0)
            `.mapWith(Number),
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
        .orderBy(countryNames.commonName);

    const loadedCountries = await Promise.all(
        countriesArr.map(async (country) => ({
            ...country,
            flag: await loadFile(country.flag),
        }))
    );

    return loadedCountries;
};
