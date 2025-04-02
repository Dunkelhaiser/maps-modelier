import { and, desc, eq, sql } from "drizzle-orm";
import { CountryAlliance, Ethnicity } from "../../../shared/types.js";
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
    alliances,
    allianceMembers,
    countryOffmapPopulations,
} from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getCountryById = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    const ethnicityTotals = db.$with("ethnicity_totals").as(
        db
            .select({
                countryId: countries.id,
                ethnicityId: ethnicities.id,
                ethnicityName: ethnicities.name,
                ethnicityColor: ethnicities.color,
                totalPopulation: sql<number>`
                    COALESCE(SUM(${provincePopulations.population}), 0)
                    + COALESCE((
                        SELECT SUM(${countryOffmapPopulations.population})
                        FROM ${countryOffmapPopulations}
                        WHERE ${countryOffmapPopulations.countryId} = ${countries.id}
                          AND ${countryOffmapPopulations.mapId} = ${countries.mapId}
                          AND ${countryOffmapPopulations.ethnicityId} = ${ethnicities.id}
                    ), 0)
                `.as("total_population"),
            })
            .from(countries)
            .leftJoin(countryStates, eq(countryStates.countryId, countries.id))
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
            .where(and(eq(countries.mapId, mapId), eq(countries.id, id)))
            .groupBy(countries.id, ethnicities.id, ethnicities.name, ethnicities.color)
            .union(
                db
                    .select({
                        countryId: countries.id,
                        ethnicityId: ethnicities.id,
                        ethnicityName: ethnicities.name,
                        ethnicityColor: ethnicities.color,
                        totalPopulation: sql<number>`SUM(${countryOffmapPopulations.population})`.as(
                            "total_population"
                        ),
                    })
                    .from(countries)
                    .innerJoin(
                        countryOffmapPopulations,
                        and(
                            eq(countryOffmapPopulations.countryId, countries.id),
                            eq(countryOffmapPopulations.mapId, countries.mapId)
                        )
                    )
                    .innerJoin(
                        ethnicities,
                        and(
                            eq(ethnicities.id, countryOffmapPopulations.ethnicityId),
                            eq(ethnicities.mapId, countryOffmapPopulations.mapId)
                        )
                    )
                    .where(
                        and(
                            eq(countries.mapId, mapId),
                            eq(countries.id, id),
                            sql`NOT EXISTS (
                                SELECT 1
                                FROM ${provincePopulations}
                                JOIN ${stateProvinces} ON ${stateProvinces.provinceId} = ${provincePopulations.provinceId}
                                JOIN ${states} ON ${states.id} = ${stateProvinces.stateId}
                                JOIN ${countryStates} ON ${countryStates.stateId} = ${states.id}
                                WHERE ${countryStates.countryId} = ${countries.id}
                                AND ${provincePopulations.ethnicityId} = ${ethnicities.id}
                                AND ${provincePopulations.mapId} = ${countries.mapId}
                            )`
                        )
                    )
                    .groupBy(countries.id, ethnicities.id, ethnicities.name, ethnicities.color)
            )
            .orderBy(desc(sql`total_population`))
    );

    const countryEthnicities = db.$with("country_ethnicities").as(
        db
            .select({
                countryId: ethnicityTotals.countryId,
                ethnicityData: sql<string>`
                    json_group_array(
                        json_object(
                            'id', ${ethnicityTotals.ethnicityId},
                            'name', ${ethnicityTotals.ethnicityName},
                            'color', ${ethnicityTotals.ethnicityColor},
                            'population', ${ethnicityTotals.totalPopulation}
                        )
                        ORDER BY ${ethnicityTotals.totalPopulation} DESC
                    )
                    FILTER (
                        WHERE ${ethnicityTotals.ethnicityId} IS NOT NULL
                        AND ${ethnicityTotals.totalPopulation} > 0
                    )
                `.as("ethnicity_data"),
            })
            .from(ethnicityTotals)
            .groupBy(ethnicityTotals.countryId)
    );

    const countryAlliances = db.$with("country_alliances").as(
        db
            .select({
                countryId: allianceMembers.countryId,
                allianceData: sql<string>`
                    json_group_array(
                        json_object(
                            'id', ${alliances.id},
                            'name', ${alliances.name},
                            'type', ${alliances.type}
                        )
                    )
                    FILTER (WHERE ${alliances.id} IS NOT NULL)
                `.as("alliance_data"),
            })
            .from(allianceMembers)
            .leftJoin(
                alliances,
                and(eq(alliances.id, allianceMembers.allianceId), eq(alliances.mapId, allianceMembers.mapId))
            )
            .where(and(eq(allianceMembers.mapId, mapId), eq(allianceMembers.countryId, id)))
            .groupBy(allianceMembers.countryId)
    );

    const countryArr = await db
        .with(ethnicityTotals, countryEthnicities, countryAlliances)
        .select({
            id: countries.id,
            commonName: countryNames.commonName,
            officialName: countryNames.officialName,
            color: countries.color,
            flag: countryFlags.path,
            coatOfArms: countryCoatOfArms.path,
            anthemName: countryAnthems.name,
            anthemPath: countryAnthems.path,
            population: sql<number>`
                (
                    COALESCE((
                        SELECT SUM(${provincePopulations.population})
                        FROM ${provincePopulations}
                        JOIN ${stateProvinces} ON ${stateProvinces.provinceId} = ${provincePopulations.provinceId}
                        JOIN ${states} ON ${states.id} = ${stateProvinces.stateId}
                        JOIN ${countryStates} ON ${countryStates.stateId} = ${states.id}
                        WHERE ${countryStates.countryId} = ${countries.id}
                          AND ${provincePopulations.mapId} = ${countries.mapId}
                    ), 0)
                    +
                    COALESCE((
                        SELECT SUM(${countryOffmapPopulations.population})
                        FROM ${countryOffmapPopulations}
                        WHERE ${countryOffmapPopulations.countryId} = ${countries.id}
                          AND ${countryOffmapPopulations.mapId} = ${countries.mapId}
                    ), 0)
                )
            `.mapWith(Number),
            ethnicities: countryEthnicities.ethnicityData,
            alliances: countryAlliances.allianceData,
        })
        .from(countries)
        .innerJoin(countryNames, and(eq(countryNames.countryId, countries.id), eq(countryNames.mapId, countries.mapId)))
        .innerJoin(countryFlags, and(eq(countryFlags.countryId, countries.id), eq(countryFlags.mapId, countries.mapId)))
        .leftJoin(
            countryCoatOfArms,
            and(eq(countryCoatOfArms.countryId, countries.id), eq(countryCoatOfArms.mapId, countries.mapId))
        )
        .leftJoin(
            countryAnthems,
            and(eq(countryAnthems.countryId, countries.id), eq(countryAnthems.mapId, countries.mapId))
        )
        .leftJoin(countryEthnicities, eq(countryEthnicities.countryId, countries.id))
        .leftJoin(countryAlliances, eq(countryAlliances.countryId, countries.id))
        .where(and(eq(countries.mapId, mapId), eq(countries.id, id)))
        .groupBy(countries.id)
        .orderBy(countries.id);

    if (countryArr.length === 0) throw new Error("Country not found");

    const [country] = countryArr;
    const { anthemName, anthemPath, flag, coatOfArms, commonName, officialName, ...countryData } = country;

    const flagData = await loadFile(flag);
    const coatOfArmsData = coatOfArms ? await loadFile(coatOfArms) : undefined;
    const anthemData = anthemPath ? await loadFile(anthemPath) : undefined;

    return {
        ...countryData,
        name: { common: commonName, official: officialName },
        flag: flagData,
        coatOfArms: coatOfArmsData,
        anthem: anthemData && anthemName ? { name: anthemName, url: anthemData } : undefined,
        ethnicities: JSON.parse(country.ethnicities as unknown as string) as Ethnicity[],
        alliances: (JSON.parse(country.alliances as unknown as string) ?? []) as CountryAlliance[],
    };
};
