import { and, eq, getTableColumns } from "drizzle-orm";
import { CreateCountryInput, createCountrySchema } from "../../../shared/schemas/countries/createCountry.js";
import { db } from "../../db/db.js";
import { countries, countryFlags, countryNames } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";
import { saveFile } from "../utils/saveFile.js";

export const createCountry = async (_: Electron.IpcMainInvokeEvent, mapId: string, input: CreateCountryInput) => {
    const attributes = await createCountrySchema.parseAsync(input);
    const { flag: flagInput, name, ...countryData } = attributes;
    const { mapId: mapIdCol, createdAt, updatedAt, ...countryCols } = getTableColumns(countries);

    const countryFolder = ["media", mapId, attributes.tag];

    const flagPath = await saveFile(flagInput, "flag", countryFolder);

    const existingCountry = await db
        .select({ tag: countries.tag })
        .from(countries)
        .where(and(eq(countries.mapId, mapId), eq(countries.tag, attributes.tag)));

    if (existingCountry.length) throw new Error(`Country with tag ${attributes.tag} already exists`);

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

        const flagData = await loadFile(flagPath);

        return {
            ...createdCountry,
            name,
            flag: flagData,
        };
    });
};
