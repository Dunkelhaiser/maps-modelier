import { getTableColumns } from "drizzle-orm";
import { CreateCountryInput, createCountrySchema } from "../../../shared/schemas/countries/createCountry.js";
import { EthnicityComposition } from "../../../shared/types.js";
import { db } from "../../db/db.js";
import { countries, countryFlags, countryCoatOfArms, countryAnthems, countryNames } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";
import { saveFile } from "../utils/saveFile.js";

export const createCountry = async (_: Electron.IpcMainInvokeEvent, mapId: string, input: CreateCountryInput) => {
    const attributes = await createCountrySchema.parseAsync(input);
    const { anthem, flag: flagInput, coatOfArms: coatOfArmsInput, name, ...countryData } = attributes;
    const { mapId: mapIdCol, createdAt, updatedAt, ...countryCols } = getTableColumns(countries);

    const countryFolder = ["media", mapId, attributes.tag];

    const flagPath = await saveFile(flagInput, "flag", countryFolder);
    const coatOfArmsPath = await saveFile(coatOfArmsInput, "coat_of_arms", countryFolder);
    const anthemPath = await saveFile(anthem.url, "anthem", countryFolder);

    return await db.transaction(async (tx) => {
        const [createdCountry] = await tx
            .insert(countries)
            .values({
                mapId,
                ...countryData,
            })
            .returning(countryCols);

        await tx.insert(countryNames).values({
            mapId,
            countryTag: attributes.tag,
            commonName: name,
        });

        await tx.insert(countryFlags).values({
            mapId,
            countryTag: attributes.tag,
            path: flagPath,
        });

        await tx.insert(countryCoatOfArms).values({
            mapId,
            countryTag: attributes.tag,
            path: coatOfArmsPath,
        });

        await tx.insert(countryAnthems).values({
            mapId,
            countryTag: attributes.tag,
            name: anthem.name,
            path: anthemPath,
        });

        const flagData = await loadFile(flagPath);
        const coatOfArmsData = await loadFile(coatOfArmsPath);
        const anthemData = await loadFile(anthemPath);

        return {
            ...createdCountry,
            name,
            flag: flagData,
            coatOfArms: coatOfArmsData,
            anthem: { name: anthem.name, url: anthemData },
            states: [] as number[],
            population: 0,
            ethnicities: [] as EthnicityComposition[],
        };
    });
};
