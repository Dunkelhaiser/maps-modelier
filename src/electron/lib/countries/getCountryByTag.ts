import { and, desc, eq, sql, sum } from "drizzle-orm";
import { EthnicityComposition } from "../../../shared/types.js";
import { db } from "../../db/db.js";
import {
    countries,
    countryStates,
    states,
    stateProvinces,
    provincePopulations,
    ethnicities,
    countryNames,
    countryFlags,
    countryCoatOfArms,
    countryAnthems,
} from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getCountryByTag = async (_: Electron.IpcMainInvokeEvent, mapId: string, tag: string) => {
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
            .where(and(eq(countries.mapId, mapId), eq(countries.tag, tag)))
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

    const countryArr = await db
        .with(ethnicityTotals, countryEthnicities)
        .select({
            tag: countries.tag,
            name: countryNames.commonName,
            color: countries.color,
            flag: countryFlags.path,
            coatOfArms: countryCoatOfArms.path,
            anthemName: countryAnthems.name,
            anthemPath: countryAnthems.path,
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
        .leftJoin(
            countryNames,
            and(eq(countryNames.countryTag, countries.tag), eq(countryNames.mapId, countries.mapId))
        )
        .leftJoin(
            countryFlags,
            and(eq(countryFlags.countryTag, countries.tag), eq(countryFlags.mapId, countries.mapId))
        )
        .leftJoin(
            countryCoatOfArms,
            and(eq(countryCoatOfArms.countryTag, countries.tag), eq(countryCoatOfArms.mapId, countries.mapId))
        )
        .leftJoin(
            countryAnthems,
            and(eq(countryAnthems.countryTag, countries.tag), eq(countryAnthems.mapId, countries.mapId))
        )
        .leftJoin(countryStates, eq(countryStates.countryTag, countries.tag))
        .leftJoin(countryEthnicities, eq(countryEthnicities.countryTag, countries.tag))
        .where(and(eq(countries.mapId, mapId), eq(countries.tag, tag)))
        .groupBy(countries.tag)
        .orderBy(countries.tag);

    if (countryArr.length === 0) throw new Error("Country not found");

    const [country] = countryArr;
    const { anthemName, anthemPath, flag, coatOfArms, ...countryData } = country;

    const [flagData, coatOfArmsData, anthemData] = await Promise.all([
        loadFile(flag ?? ""),
        loadFile(coatOfArms ?? ""),
        loadFile(anthemPath ?? ""),
    ]);

    return {
        ...countryData,
        name: countryData.name!,
        flag: flagData,
        coatOfArms: coatOfArmsData,
        anthem: {
            name: anthemName,
            url: anthemData,
        },
        ethnicities: JSON.parse(country.ethnicities as unknown as string) as EthnicityComposition[],
    };
};
