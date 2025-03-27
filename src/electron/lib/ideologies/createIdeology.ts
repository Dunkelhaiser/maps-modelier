import { IdeologyInput, ideologySchema } from "../../../shared/schemas/ideologies/ideology.js";
import { db } from "../../db/db.js";
import { ideologies } from "../../db/schema.js";

export const createIdeology = async (_: Electron.IpcMainInvokeEvent, mapId: string, data: IdeologyInput) => {
    const parsedData = await ideologySchema.parseAsync(data);

    const [createdIdeology] = await db
        .insert(ideologies)
        .values({
            mapId,
            ...parsedData,
        })
        .returning({
            id: ideologies.id,
            name: ideologies.name,
            color: ideologies.color,
        });

    return createdIdeology;
};
