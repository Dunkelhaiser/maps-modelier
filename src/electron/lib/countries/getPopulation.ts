import { and, eq, desc } from "drizzle-orm";
import { db } from "../../db/db.js";
import {
    countryOffmapPopulations,
    provincePopulations,
    stateProvinces,
    states,
    countryStates,
    ethnicities,
} from "../../db/schema.js";

export const getPopulation = async (_: Electron.IpcMainInvokeEvent, mapId: string, countryId: number) => {
    const onMapPopulation = await db
        .select({
            id: provincePopulations.ethnicityId,
            population: provincePopulations.population,
            name: ethnicities.name,
            color: ethnicities.color,
        })
        .from(provincePopulations)
        .innerJoin(stateProvinces, eq(stateProvinces.provinceId, provincePopulations.provinceId))
        .innerJoin(states, eq(states.id, stateProvinces.stateId))
        .innerJoin(countryStates, eq(countryStates.stateId, states.id))
        .innerJoin(
            ethnicities,
            and(eq(ethnicities.id, provincePopulations.ethnicityId), eq(ethnicities.mapId, provincePopulations.mapId))
        )
        .where(and(eq(provincePopulations.mapId, mapId), eq(countryStates.countryId, countryId)))
        .orderBy(desc(provincePopulations.population));

    const offMapPopulation = await db
        .select({
            id: countryOffmapPopulations.ethnicityId,
            population: countryOffmapPopulations.population,
            name: ethnicities.name,
            color: ethnicities.color,
        })
        .from(countryOffmapPopulations)
        .innerJoin(
            ethnicities,
            and(
                eq(ethnicities.id, countryOffmapPopulations.ethnicityId),
                eq(ethnicities.mapId, countryOffmapPopulations.mapId)
            )
        )
        .where(and(eq(countryOffmapPopulations.mapId, mapId), eq(countryOffmapPopulations.countryId, countryId)))
        .orderBy(desc(countryOffmapPopulations.population));

    return {
        onMapPopulation,
        offMapPopulation,
    };
};
