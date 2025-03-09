import { and, eq, sql, sum } from "drizzle-orm";
import { Type } from "../../../shared/types.js";
import { db } from "../../db/db.js";
import { provinces, provincePopulations, ethnicities } from "../../db/schema.js";

interface Ethnicity {
    id: number;
    name: string;
    population: number;
}

export const getAllProvinces = async (_: Electron.IpcMainInvokeEvent, mapId: string, type?: Type) => {
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
                        'population', ${provincePopulations.population}
                    )
                )
            `.as("ethnicities"),
        })
        .from(provinces)
        .leftJoin(provincePopulations, eq(provinces.id, provincePopulations.provinceId))
        .leftJoin(
            ethnicities,
            and(eq(ethnicities.id, provincePopulations.ethnicityId), eq(ethnicities.mapId, provincePopulations.mapId))
        )
        .where(and(eq(provinces.mapId, mapId), type ? eq(provinces.type, type) : undefined))
        .orderBy(provinces.id)
        .groupBy(provinces.id);

    return provincesArr.map((province) => ({
        ...province,
        type: province.type as Type,
        ethnicities: (
            JSON.parse(province.ethnicities as unknown as string) as (
                | Ethnicity
                | { id: null; name: string; population: number }
            )[]
        ).filter((e) => e.id !== null),
    }));
};
