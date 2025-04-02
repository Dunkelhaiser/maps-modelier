import { and, eq, inArray, sql } from "drizzle-orm";
import { PopulationInput, populationSchema } from "../../../shared/schemas/provinces/population.js";
import { db } from "../../db/db.js";
import { countryOffmapPopulations } from "../../db/schema.js";

export const addOffmapPopulation = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    countryId: number,
    data: PopulationInput
) => {
    const offmapPopulation = await populationSchema.parseAsync(data);

    const populations = await db.transaction(async (tx) => {
        const existingPopulations = await tx
            .select()
            .from(countryOffmapPopulations)
            .where(and(eq(countryOffmapPopulations.mapId, mapId), eq(countryOffmapPopulations.countryId, countryId)));

        const existingEthnicitiesIds = new Set(existingPopulations.map((p) => p.ethnicityId));
        const newEthnicitiesIds = new Set(offmapPopulation.map((p) => p.ethnicityId));
        const ethnicitiesIdsToRemove = [...existingEthnicitiesIds].filter((id) => !newEthnicitiesIds.has(id));

        if (ethnicitiesIdsToRemove.length > 0) {
            await tx
                .delete(countryOffmapPopulations)
                .where(
                    and(
                        eq(countryOffmapPopulations.mapId, mapId),
                        eq(countryOffmapPopulations.countryId, countryId),
                        inArray(countryOffmapPopulations.ethnicityId, ethnicitiesIdsToRemove)
                    )
                );
        }

        if (offmapPopulation.length === 0) return [];

        return await tx
            .insert(countryOffmapPopulations)
            .values(
                offmapPopulation.map(({ ethnicityId, population }) => ({
                    mapId,
                    countryId,
                    ethnicityId,
                    population,
                }))
            )
            .onConflictDoUpdate({
                target: [
                    countryOffmapPopulations.mapId,
                    countryOffmapPopulations.countryId,
                    countryOffmapPopulations.ethnicityId,
                ],
                set: {
                    population: sql`excluded.population`,
                },
            })
            .returning({
                ethnicityId: countryOffmapPopulations.ethnicityId,
                population: countryOffmapPopulations.population,
            });
    });

    return populations;
};
