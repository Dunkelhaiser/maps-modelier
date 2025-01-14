import { getTableColumns } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countries } from "../../db/schema.js";
import { saveFile } from "../utils/saveFile.js";

export interface CreateCountryAttributes {
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
        anthem: { name: anthemName },
        ...data
    } = attributes;

    const countryFolder = ["media", mapId, attributes.tag];
    const flag = await saveFile(attributes.flag, "flag", countryFolder);
    const coatOfArms = await saveFile(attributes.coatOfArms, "coat_of_arms", countryFolder);
    const anthem = await saveFile(attributes.anthem.url, "anthem", countryFolder);

    const [createdCountry] = await db
        .insert(countries)
        .values({
            mapId,
            ...data,
            flag,
            coatOfArms,
            anthemName,
            anthemPath: anthem,
        })
        .returning(cols);

    return createdCountry;
};
