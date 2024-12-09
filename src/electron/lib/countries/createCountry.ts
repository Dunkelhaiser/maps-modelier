import { db } from "../../db/db.js";
import { countries } from "../../db/schema.js";

export const createCountry = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    name: string,
    tag: string,
    color?: string
) => {
    const [createdCountry] = await db
        .insert(countries)
        .values({
            mapId,
            name,
            tag,
            color,
        })
        .returning({
            tag: countries.tag,
            name: countries.name,
            color: countries.color,
        });

    return createdCountry;
};
