import { and, eq, sql } from "drizzle-orm";
import { db } from "../../db/db.js";
import { states, stateProvinces, provincePopulations, ethnicities } from "../../db/schema.js";

interface Ethnicity {
    id: number;
    name: string;
    population: number;
}

export const getAllStates = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const ethnicityTotals = db.$with("ethnicity_totals").as(
        db
            .select({
                stateId: states.id,
                ethnicityId: ethnicities.id,
                ethnicityName: ethnicities.name,
                totalPopulation: sql<number>`SUM(${provincePopulations.population})`.as("total_population"),
            })
            .from(states)
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
            .where(eq(states.mapId, mapId))
            .groupBy(states.id, ethnicities.id, ethnicities.name)
    );

    const stateEthnicities = db.$with("state_ethnicities").as(
        db
            .select({
                stateId: ethnicityTotals.stateId,
                ethnicityData: sql<string>`
                json_group_array(
                    json_object(
                        'id', ${ethnicityTotals.ethnicityId},
                        'name', ${ethnicityTotals.ethnicityName},
                        'population', ${ethnicityTotals.totalPopulation}
                    )
                )
            `.as("ethnicity_data"),
            })
            .from(ethnicityTotals)
            .groupBy(ethnicityTotals.stateId)
    );

    const statesArr = await db
        .with(ethnicityTotals, stateEthnicities)
        .select({
            id: states.id,
            name: states.name,
            type: states.type,
            provinces: sql<string>`COALESCE(GROUP_CONCAT(DISTINCT ${stateProvinces.provinceId}), '')`,
            population: sql<number>`
                COALESCE((
                    SELECT SUM(${provincePopulations.population})
                    FROM ${provincePopulations}
                    JOIN ${stateProvinces} ON ${stateProvinces.provinceId} = ${provincePopulations.provinceId}
                    WHERE ${stateProvinces.stateId} = ${states.id}
                    AND ${provincePopulations.mapId} = ${states.mapId}
                ), 0)
            `.mapWith(Number),
            ethnicities: stateEthnicities.ethnicityData,
        })
        .from(states)
        .leftJoin(stateProvinces, eq(stateProvinces.stateId, states.id))
        .leftJoin(stateEthnicities, eq(stateEthnicities.stateId, states.id))
        .where(eq(states.mapId, mapId))
        .groupBy(states.id)
        .orderBy(states.id);

    return statesArr.map((state) => ({
        ...state,
        provinces: state.provinces ? state.provinces.split(",").map(Number) : [],
        ethnicities: (
            JSON.parse(state.ethnicities as unknown as string) as (Omit<Ethnicity, "id"> & { id: number | null })[]
        ).filter((e) => e.id !== null && e.population > 0),
    }));
};
