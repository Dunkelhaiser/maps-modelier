import { eq, sql } from "drizzle-orm";
import { getEthnicitiesSchema, GetEthnicitiesInput } from "../../../shared/schemas/ethnicities/getEthnicities.js";
import { db } from "../../db/db.js";
import { countryOffmapPopulations, ethnicities, provincePopulations } from "../../db/schema.js";
import { orderBy } from "../utils/orderBy.js";

export const getAllEthnicities = async (_: Electron.IpcMainInvokeEvent, mapId: string, query?: GetEthnicitiesInput) => {
    const { sortBy, sortOrder } = await getEthnicitiesSchema.parseAsync(query);

    const populationQuery = sql<number>`
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
    `.mapWith(Number);

    const sortOptions = {
        name: ethnicities.name,
        population: populationQuery,
    };

    const orderQuery = orderBy(sortOptions[sortBy], sortOrder);

    const ethnicitiesArr = await db
        .select({
            id: ethnicities.id,
            name: ethnicities.name,
            color: ethnicities.color,
            population: populationQuery,
        })
        .from(ethnicities)
        .where(eq(ethnicities.mapId, mapId))
        .groupBy(ethnicities.id, ethnicities.name, ethnicities.color)
        .orderBy(orderQuery);

    return ethnicitiesArr;
};
