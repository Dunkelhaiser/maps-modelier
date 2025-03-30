import { ParliamentInput, parliamentSchema } from "../../../shared/schemas/politics/parliament.js";
import { db } from "../../db/db.js";
import { parliaments } from "../../db/schema.js";

export const createParliament = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    countryId: number,
    data: ParliamentInput
) => {
    const parsedData = await parliamentSchema.parseAsync(data);

    const [createdParliament] = await db
        .insert(parliaments)
        .values({
            mapId,
            countryId,
            ...parsedData,
        })
        .returning({
            id: parliaments.id,
        });

    return createdParliament;
};
