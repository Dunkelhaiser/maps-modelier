import { EthnicityInput, ethnicitySchema } from "../../../shared/schemas/ethnicities/ethnicity.js";
import { db } from "../../db/db.js";
import { ethnicities } from "../../db/schema.js";

export const createEthnicity = async (_: Electron.IpcMainInvokeEvent, mapId: string, data: EthnicityInput) => {
    const { name } = await ethnicitySchema.parseAsync(data);

    const [createdEthnicity] = await db
        .insert(ethnicities)
        .values({
            mapId,
            name,
        })
        .returning({
            id: ethnicities.id,
            name: ethnicities.name,
        });

    return createdEthnicity;
};
