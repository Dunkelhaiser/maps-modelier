import { and, eq } from "drizzle-orm";
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

    const existingParliament = await db
        .select()
        .from(parliaments)
        .where(and(eq(parliaments.mapId, mapId), eq(parliaments.countryId, countryId)));

    if (existingParliament.length > 0) throw new Error("Parliament already exists");

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
