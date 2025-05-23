import { and, eq, inArray, sql } from "drizzle-orm";
import { PopulationInput, populationSchema } from "../../../shared/schemas/provinces/population.js";
import { db } from "../../db/db.js";
import { provincePopulations } from "../../db/schema.js";

export const addPopulation = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    provinceId: number,
    data: PopulationInput
) => {
    const ethnicityPopulation = await populationSchema.parseAsync(data);

    await db.transaction(async (tx) => {
        const existingPopulations = await tx
            .select()
            .from(provincePopulations)
            .where(and(eq(provincePopulations.mapId, mapId), eq(provincePopulations.provinceId, provinceId)));

        const existingEthnicitiesIds = new Set(existingPopulations.map((p) => p.ethnicityId));
        const newEthnicitiesIds = new Set(ethnicityPopulation.map((p) => p.ethnicityId));

        const ethnicitiesIdsToRemove = [...existingEthnicitiesIds].filter((id) => !newEthnicitiesIds.has(id));

        if (ethnicitiesIdsToRemove.length > 0) {
            await tx
                .delete(provincePopulations)
                .where(
                    and(
                        eq(provincePopulations.mapId, mapId),
                        eq(provincePopulations.provinceId, provinceId),
                        inArray(provincePopulations.ethnicityId, ethnicitiesIdsToRemove)
                    )
                );
        }

        if (ethnicityPopulation.length === 0) return [];

        return await tx
            .insert(provincePopulations)
            .values(
                ethnicityPopulation.map(({ ethnicityId, population }) => ({
                    mapId,
                    provinceId,
                    ethnicityId,
                    population,
                }))
            )
            .onConflictDoUpdate({
                target: [provincePopulations.mapId, provincePopulations.provinceId, provincePopulations.ethnicityId],
                set: {
                    population: sql`excluded.population`,
                },
            });
    });
};
