import { and, desc, eq, sql, sum } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countries, countryStates, states, stateProvinces, provincePopulations, ethnicities } from "../../db/schema.js";

interface Ethnicity {
    id: number;
    name: string;
    population: number;
}

export const getAllCountries = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const ethnicityTotals = db.$with("ethnicity_totals").as(
        db
            .select({
                countryTag: countries.tag,
                ethnicityId: ethnicities.id,
                ethnicityName: ethnicities.name,
                totalPopulation: sum(provincePopulations.population).as("total_population"),
            })
            .from(countries)
            .leftJoin(countryStates, eq(countryStates.countryTag, countries.tag))
            .leftJoin(states, eq(states.id, countryStates.stateId))
            .leftJoin(stateProvinces, eq(stateProvinces.stateId, states.id))
            .leftJoin(
                provincePopulations,
                and(
                    eq(provincePopulations.provinceId, stateProvinces.provinceId),
                    eq(provincePopulations.mapId, stateProvinces.mapId)
                )
            )
            .leftJoin(
                ethnicities,
                and(
                    eq(ethnicities.id, provincePopulations.ethnicityId),
                    eq(ethnicities.mapId, provincePopulations.mapId)
                )
            )
            .where(eq(countries.mapId, mapId))
            .groupBy(countries.tag, ethnicities.id, ethnicities.name)
            .orderBy(desc(sum(provincePopulations.population)))
    );

    const countryEthnicities = db.$with("country_ethnicities").as(
        db
            .select({
                countryTag: ethnicityTotals.countryTag,
                ethnicityData: sql<string>`
                json_group_array(
                    json_object(
                        'id', ${ethnicityTotals.ethnicityId},
                        'name', ${ethnicityTotals.ethnicityName},
                        'population', ${ethnicityTotals.totalPopulation}
                    )
                ) FILTER (WHERE ${ethnicityTotals.ethnicityId} IS NOT NULL AND ${ethnicityTotals.totalPopulation} > 0)
            `.as("ethnicity_data"),
            })
            .from(ethnicityTotals)
            .groupBy(ethnicityTotals.countryTag)
    );

    const countriesArr = await db
        .with(ethnicityTotals, countryEthnicities)
        .select({
            tag: countries.tag,
            name: countries.name,
            color: countries.color,
            flag: countries.flag,
            coatOfArms: countries.coatOfArms,
            anthemName: countries.anthemName,
            anthemPath: countries.anthemPath,
            states: sql<string>`COALESCE(GROUP_CONCAT(${countryStates.stateId}), '')`,
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
            ethnicities: countryEthnicities.ethnicityData,
        })
        .from(countries)
        .leftJoin(countryStates, eq(countryStates.countryTag, countries.tag))
        .leftJoin(countryEthnicities, eq(countryEthnicities.countryTag, countries.tag))
        .where(eq(countries.mapId, mapId))
        .groupBy(countries.tag)
        .orderBy(countries.tag);

    return countriesArr.map((country) => {
        const { anthemName, anthemPath, ...countryData } = country;
        return {
            ...countryData,
            anthem: {
                name: anthemName,
                url: anthemPath,
            },
            states: country.states ? country.states.split(",").map(Number) : [],
            ethnicities: JSON.parse(country.ethnicities as unknown as string) as (Omit<Ethnicity, "id"> & {
                id: number | null;
            })[],
        };
    });
};
