import path from "path";
import { and, eq, getTableColumns } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countries } from "../../db/schema.js";
import { deleteFile } from "../utils/deleteFile.js";
import { saveFile } from "../utils/saveFile.js";
import { CreateCountryAttributes } from "./createCountry.js";

export const updateCountry = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    countryTag: string,
    attributes: Partial<CreateCountryAttributes>
) => {
    const { mapId: mapIdCol, createdAt, updatedAt, ...cols } = getTableColumns(countries);

    const country = await db
        .select()
        .from(countries)
        .where(and(eq(countries.tag, countryTag), eq(countries.mapId, mapId)));

    if (country.length === 0) throw new Error(`Country with tag ${countryTag} not found`);

    const countryFolder = ["media", mapId, countryTag];

    let flag, coatOfArms, anthem;

    if (attributes.flag) {
        const flagFile = path.basename(country[0].flag);
        await deleteFile(flagFile, countryFolder);
        flag = await saveFile(attributes.flag, `flag`, countryFolder);
    }

    if (attributes.coatOfArms) {
        const coatOfArmsFile = path.basename(country[0].coatOfArms);
        await deleteFile(coatOfArmsFile, countryFolder);
        coatOfArms = await saveFile(attributes.coatOfArms, `coat_of_arms`, countryFolder);
    }

    if (attributes.anthem?.url) {
        const anthemFile = path.basename(country[0].anthemPath);
        await deleteFile(anthemFile, countryFolder);
        anthem = await saveFile(attributes.anthem.url, `anthem`, countryFolder);
    }

    const [updatedCountry] = await db
        .update(countries)
        .set({
            mapId,
            ...attributes,
            flag,
            coatOfArms,
            anthemName: attributes.anthem?.name,
            anthemPath: anthem,
        })
        .where(and(eq(countries.tag, countryTag), eq(countries.mapId, mapId)))
        .returning(cols);

    return updatedCountry;
};
