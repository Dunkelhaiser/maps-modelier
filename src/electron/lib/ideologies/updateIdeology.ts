import { and, eq } from "drizzle-orm";
import { IdeologyInput, ideologySchema } from "../../../shared/schemas/ideologies/ideology.js";
import { db } from "../../db/db.js";
import { ideologies } from "../../db/schema.js";

export const updateIdeology = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    id: number,
    data: IdeologyInput
) => {
    const parsedData = await ideologySchema.parseAsync(data);

    const [updatedIdeology] = await db
        .update(ideologies)
        .set(parsedData)
        .where(and(eq(ideologies.id, id), eq(ideologies.mapId, mapId)))
        .returning({
            id: ideologies.id,
            name: ideologies.name,
            color: ideologies.color,
        });

    return updatedIdeology;
};
