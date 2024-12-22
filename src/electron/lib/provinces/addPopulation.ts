import { db } from "../../db/db.js";
import { provincePopulations } from "../../db/schema.js";

export const addPopulation = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    provinceId: number,
    ethnicityId: number,
    population: number
) => {
    const [addedPopulation] = await db
        .insert(provincePopulations)
        .values({
            mapId,
            ethnicityId,
            population,
            provinceId,
        })
        .returning({
            provinceId: provincePopulations.provinceId,
            ethnicityId: provincePopulations.ethnicityId,
            population: provincePopulations.population,
        });

    return addedPopulation;
};
