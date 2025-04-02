import { eq, sql } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countryOffmapPopulations, ethnicities, provincePopulations } from "../../db/schema.js";

export const getAllEthnicities = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const ethnicitiesArr = await db
        .select({
            id: ethnicities.id,
            name: ethnicities.name,
            color: ethnicities.color,
            population: sql<number>`
                COALESCE(
                    (
                        SELECT SUM(${provincePopulations.population})
                        FROM ${provincePopulations}
                        WHERE ${provincePopulations.ethnicityId} = ${ethnicities.id}
                        AND ${provincePopulations.mapId} = ${ethnicities.mapId}
                    ), 0
                ) + 
                COALESCE(
                    (
                        SELECT SUM(${countryOffmapPopulations.population})
                        FROM ${countryOffmapPopulations}
                        WHERE ${countryOffmapPopulations.ethnicityId} = ${ethnicities.id}
                        AND ${countryOffmapPopulations.mapId} = ${ethnicities.mapId}
                    ), 0
                )
            `.mapWith(Number),
        })
        .from(ethnicities)
        .where(eq(ethnicities.mapId, mapId))
        .orderBy(ethnicities.name)
        .groupBy(ethnicities.id, ethnicities.name);

    return ethnicitiesArr;
};
