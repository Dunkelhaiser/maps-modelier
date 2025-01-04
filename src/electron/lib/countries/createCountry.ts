import { getTableColumns } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countries } from "../../db/schema.js";

interface CreateCountryAttributes {
    name: string;
    tag: string;
    color?: string;
    flag: string;
    coatOfArms: string;
    anthem: {
        name: string;
        url: string;
    };
}

export const createCountry = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    attributes: CreateCountryAttributes
) => {
    const { mapId: mapIdCol, createdAt, updatedAt, ...cols } = getTableColumns(countries);
    const {
        anthem: { name, url },
        ...data
    } = attributes;

    const [createdCountry] = await db
        .insert(countries)
        .values({
            mapId,
            ...data,
            anthemName: name,
            anthemPath: url,
        })
        .returning(cols);

    return createdCountry;
};
