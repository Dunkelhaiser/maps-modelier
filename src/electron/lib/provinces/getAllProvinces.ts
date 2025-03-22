import { and, eq, sql, sum } from "drizzle-orm";
import { Ethnicity, ProvinceType } from "../../../shared/types.js";
import { db } from "../../db/db.js";
import { provinces, provincePopulations, ethnicities } from "../../db/schema.js";

export const getAllProvinces = async (_: Electron.IpcMainInvokeEvent, mapId: string, type?: ProvinceType) => {
    const provincesArr = await db
        .select({
            id: provinces.id,
            color: provinces.color,
            type: provinces.type,
            shape: provinces.shape,
            population: sql<number>`
                CASE 
                    WHEN ${provinces.type} = 'land' THEN COALESCE(${sum(provincePopulations.population)}, 0)
                    ELSE ${sum(provincePopulations.population)}
                END
            `.mapWith(Number),
            ethnicities: sql<Ethnicity[]>`
                json_group_array(
                    json_object(
                        'id', ${ethnicities.id},
                        'name', ${ethnicities.name},
                        'color', ${ethnicities.color},
                        'population', ${provincePopulations.population}
                    )
                    ORDER BY ${provincePopulations.population} DESC
                )
            `.as("ethnicities"),
        })
        .from(provinces)
        .leftJoin(
            provincePopulations,
            and(eq(provinces.id, provincePopulations.provinceId), eq(provincePopulations.mapId, mapId))
        )
        .leftJoin(ethnicities, and(eq(ethnicities.id, provincePopulations.ethnicityId), eq(ethnicities.mapId, mapId)))
        .where(and(eq(provinces.mapId, mapId), type ? eq(provinces.type, type) : undefined))
        .orderBy(provinces.id)
        .groupBy(provinces.id);

    return provincesArr.map((province) => ({
        ...province,
        ethnicities: (JSON.parse(province.ethnicities as unknown as string) as (Ethnicity | { id: null })[]).filter(
            (e) => e.id !== null
        ),
    }));
};
