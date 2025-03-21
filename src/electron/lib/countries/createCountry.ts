import { getTableColumns } from "drizzle-orm";
import { CreateCountryInput, createCountrySchema } from "../../../shared/schemas/countries/createCountry.js";
import { db } from "../../db/db.js";
import { countries, countryFlags, countryNames } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";
import { saveFile } from "../utils/saveFile.js";

export const createCountry = async (_: Electron.IpcMainInvokeEvent, mapId: string, input: CreateCountryInput) => {
    const attributes = await createCountrySchema.parseAsync(input);
    const { flag: flagInput, name, ...countryData } = attributes;
    const { mapId: mapIdCol, createdAt, updatedAt, ...countryCols } = getTableColumns(countries);

    return await db.transaction(async (tx) => {
        const [createdCountry] = await tx
            .insert(countries)
            .values({
                mapId,
                ...countryData,
            })
            .returning(countryCols);

        const countryFolder = ["media", mapId, `${createdCountry.id}`];
        const flagPath = await saveFile(flagInput, "flag", countryFolder);

        await tx.insert(countryNames).values({
            mapId,
            countryId: createdCountry.id,
            commonName: name,
        });

        await tx.insert(countryFlags).values({
            mapId,
            countryId: createdCountry.id,
            path: flagPath,
        });

        const flagData = await loadFile(flagPath);

        return {
            ...createdCountry,
            name,
            flag: flagData,
        };
    });
};
