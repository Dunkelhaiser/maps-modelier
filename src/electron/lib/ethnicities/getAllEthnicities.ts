import { and, eq, sum } from "drizzle-orm";
import { db } from "../../db/db.js";
import { ethnicities, provincePopulations } from "../../db/schema.js";

export const getAllEthnicities = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const ethnicitiesArr = await db
        .select({
            id: ethnicities.id,
            name: ethnicities.name,
            totalNumber: sum(provincePopulations.population),
        })
        .from(ethnicities)
        .leftJoin(
            provincePopulations,
            and(eq(provincePopulations.ethnicityId, ethnicities.id), eq(provincePopulations.mapId, ethnicities.mapId))
        )
        .where(eq(ethnicities.mapId, mapId))
        .orderBy(ethnicities.name)
        .groupBy(ethnicities.id, ethnicities.name);

    return ethnicitiesArr;
};
