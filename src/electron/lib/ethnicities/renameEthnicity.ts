import { and, eq } from "drizzle-orm";
import { EthnicityInput, ethnicitySchema } from "../../../shared/schemas/ethnicities/ethnicity.js";
import { db } from "../../db/db.js";
import { ethnicities } from "../../db/schema.js";

export const renameEthnicity = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    id: number,
    data: EthnicityInput
) => {
    const parsedData = await ethnicitySchema.parseAsync(data);

    const [updatedEthnicity] = await db
        .update(ethnicities)
        .set(parsedData)
        .where(and(eq(ethnicities.id, id), eq(ethnicities.mapId, mapId)))
        .returning({
            id: ethnicities.id,
            name: ethnicities.name,
            color: ethnicities.color,
        });

    return updatedEthnicity;
};
