import { and, eq } from "drizzle-orm";
import { ParliamentInput, parliamentSchema } from "../../../shared/schemas/politics/parliament.js";
import { db } from "../../db/db.js";
import { parliaments } from "../../db/schema.js";
import { checkParliamentExistence } from "./checkParliamentExistence.js";

export const updateParliament = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    id: number,
    data: ParliamentInput
) => {
    const parsedData = await parliamentSchema.parseAsync(data);

    await checkParliamentExistence(mapId, id);

    await db
        .update(parliaments)
        .set(parsedData)
        .where(and(eq(parliaments.id, id), eq(parliaments.mapId, mapId)));
};
