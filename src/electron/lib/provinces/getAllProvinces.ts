import { and, eq, isNotNull, sql, sum } from "drizzle-orm";
import { Ethnicity, Province, ProvinceType } from "../../../shared/types.js";
import { db } from "../../db/db.js";
import { provinces, provincePopulations, ethnicities } from "../../db/schema.js";

export const getAllProvinces = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    type?: ProvinceType
): Promise<Province[]> => {
    const populationExpression = sql<number>`
            CASE 
                WHEN ${provinces.type} = 'land' THEN COALESCE(${sum(provincePopulations.population)}, 0)
                ELSE ${sum(provincePopulations.population)}
            END
        `.mapWith(Number);

    const ethnicitiesExpression = sql<string>`
            json_group_array(
                json_object(
                    'id', ${ethnicities.id},
                    'name', ${ethnicities.name},
                    'color', ${ethnicities.color},
                    'population', ${provincePopulations.population}
                )
                ORDER BY ${provincePopulations.population} DESC
            )
        `.as("ethnicities");

    const provincesData = await db
        .select({
            id: provinces.id,
            color: provinces.color,
            type: provinces.type,
            shape: provinces.shape,
            population: populationExpression,
            ethnicities: ethnicitiesExpression,
        })
        .from(provinces)
        .leftJoin(
            provincePopulations,
            and(eq(provinces.id, provincePopulations.provinceId), eq(provincePopulations.mapId, mapId))
        )
        .leftJoin(
            ethnicities,
            and(
                eq(ethnicities.id, provincePopulations.ethnicityId),
                eq(ethnicities.mapId, mapId),
                isNotNull(ethnicities.id)
            )
        )
        .where(and(eq(provinces.mapId, mapId), type ? eq(provinces.type, type) : undefined))
        .orderBy(provinces.id)
        .groupBy(provinces.id);

    return provincesData.map((province) => ({
        ...province,
        ethnicities: JSON.parse(province.ethnicities) as Ethnicity[],
    }));
};
