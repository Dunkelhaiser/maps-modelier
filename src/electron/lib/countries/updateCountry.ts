import path from "path";
import { and, eq, getTableColumns } from "drizzle-orm";
import { CreateCountryAttributes, DeepPartial } from "../../../shared/types.js";
import { db } from "../../db/db.js";
import { countries, countryStates } from "../../db/schema.js";
import { deleteFile } from "../utils/deleteFile.js";
import { loadFile } from "../utils/loadFile.js";
import { saveFile } from "../utils/saveFile.js";

export const updateCountry = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    countryTag: string,
    attributes: DeepPartial<CreateCountryAttributes>
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

    const flagData = await loadFile(updatedCountry.flag);
    const coatOfArmsData = await loadFile(updatedCountry.coatOfArms);
    const anthemData = await loadFile(updatedCountry.anthemPath);

    const { anthemName, anthemPath, flag: flagField, coatOfArms: coatOfArmsField, ...countryData } = updatedCountry;

    const states = await db.select().from(countryStates).where(eq(countryStates.countryTag, countryTag));

    return {
        ...countryData,
        states: states.map((state) => state.stateId),
        flag: flagData,
        coatOfArms: coatOfArmsData,
        anthem: { name: updatedCountry.anthemName, url: anthemData },
    };
};
