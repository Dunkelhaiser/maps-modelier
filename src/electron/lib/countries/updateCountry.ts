import { and, eq, getTableColumns } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countries } from "../../db/schema.js";

export interface CountryProperties {
    tag?: string;
    name?: string;
    color?: string;
}

export const updateCountry = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    countryTag: string,
    options: CountryProperties
) => {
    const { mapId: mapIdCol, createdAt, updatedAt, ...cols } = getTableColumns(countries);

    const [updatedCountry] = await db
        .update(countries)
        .set({ ...options })
        .where(and(eq(countries.tag, countryTag), eq(countries.mapId, mapId)))
        .returning(cols);

    return updatedCountry;
};
