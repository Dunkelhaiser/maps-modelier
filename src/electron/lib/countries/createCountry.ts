import { db } from "../../db/db.js";
import { countries } from "../../db/schema.js";

export const createCountry = async (_: Electron.IpcMainInvokeEvent, mapId: string, name: string, tag: string) => {
    const [createdCountry] = await db
        .insert(countries)
        .values({
            mapId,
            name,
            tag,
        })
        .returning({
            tag: countries.tag,
            name: countries.name,
            color: countries.color,
        });

    return createdCountry;
};
