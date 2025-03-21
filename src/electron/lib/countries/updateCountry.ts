import path from "path";
import { and, eq, getTableColumns } from "drizzle-orm";
import { UpdateCountryInput, updateCountrySchema } from "../../../shared/schemas/countries/updateCountry.js";
import { db } from "../../db/db.js";
import {
    countries,
    countryStates,
    countryNames,
    countryFlags,
    countryCoatOfArms,
    countryAnthems,
} from "../../db/schema.js";
import { deleteFile } from "../utils/deleteFile.js";
import { loadFile } from "../utils/loadFile.js";
import { saveFile } from "../utils/saveFile.js";

export const updateCountry = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    id: number,
    input: UpdateCountryInput
) => {
    const { mapId: mapIdCol, createdAt, updatedAt, ...countryCols } = getTableColumns(countries);
    const attributes = await updateCountrySchema.parseAsync(input);

    const existingCountry = await db
        .select()
        .from(countries)
        .where(and(eq(countries.id, id), eq(countries.mapId, mapId)));

    if (existingCountry.length === 0) throw new Error(`Country not found`);

    const existingFlagArr = await db
        .select({
            path: countryFlags.path,
        })
        .from(countryFlags)
        .where(and(eq(countryFlags.countryId, id), eq(countryFlags.mapId, mapId)));

    const existingCoatOfArmsArr = await db
        .select({
            path: countryCoatOfArms.path,
        })
        .from(countryCoatOfArms)
        .where(and(eq(countryCoatOfArms.countryId, id), eq(countryCoatOfArms.mapId, mapId)));

    const existingAnthemArr = await db
        .select({
            name: countryAnthems.name,
            path: countryAnthems.path,
        })
        .from(countryAnthems)
        .where(and(eq(countryAnthems.countryId, id), eq(countryAnthems.mapId, mapId)));

    const existingFlag = existingFlagArr.length === 0 ? null : existingFlagArr[0];
    const existingCoatOfArms = existingCoatOfArmsArr.length === 0 ? null : existingCoatOfArmsArr[0];
    const existingAnthem = existingAnthemArr.length === 0 ? null : existingAnthemArr[0];

    const countryFolder = ["media", mapId, `${id}`];

    const { name, flag: flagInput, coatOfArms: coatOfArmsInput, anthem: anthemInput, ...countryData } = attributes;

    return await db.transaction(async (tx) => {
        const [updatedCountry] = await tx
            .update(countries)
            .set({
                ...countryData,
            })
            .where(and(eq(countries.id, id), eq(countries.mapId, mapId)))
            .returning(countryCols);

        await tx
            .insert(countryNames)
            .values({
                mapId,
                countryId: id,
                commonName: name.common,
                officialName: name.official.length > 0 ? name.official : null,
            })
            .onConflictDoUpdate({
                target: [countryNames.mapId, countryNames.countryId],
                set: {
                    commonName: name.common,
                    officialName: name.official.length > 0 ? name.official : null,
                },
            });

        let flagPath = existingFlag ? existingFlag.path : "";
        if (flagInput) {
            if (existingFlag) {
                const flagFile = path.basename(existingFlag.path);
                await deleteFile(flagFile, countryFolder);
            }

            flagPath = await saveFile(flagInput, "flag", countryFolder);

            await tx
                .insert(countryFlags)
                .values({
                    mapId,
                    countryId: id,
                    path: flagPath,
                })
                .onConflictDoUpdate({
                    target: [countryFlags.mapId, countryFlags.countryId],
                    set: {
                        path: flagPath,
                    },
                });
        }

        let coatOfArmsPath = existingCoatOfArms ? existingCoatOfArms.path : "";
        if (coatOfArmsInput) {
            if (existingCoatOfArms) {
                const coatOfArmsFile = path.basename(existingCoatOfArms.path);
                await deleteFile(coatOfArmsFile, countryFolder);
            }
            coatOfArmsPath = await saveFile(coatOfArmsInput, "coat_of_arms", countryFolder);

            await tx
                .insert(countryCoatOfArms)
                .values({
                    mapId,
                    countryId: id,
                    path: coatOfArmsPath,
                })
                .onConflictDoUpdate({
                    target: [countryCoatOfArms.mapId, countryCoatOfArms.countryId],
                    set: {
                        path: coatOfArmsPath,
                    },
                });
        }

        let anthemPath = existingAnthem ? existingAnthem.path : "";
        if (anthemInput.url && anthemInput.name) {
            if (existingAnthem) {
                const anthemFile = path.basename(existingAnthem.path);
                await deleteFile(anthemFile, countryFolder);
            }
            anthemPath = await saveFile(anthemInput.url, "anthem", countryFolder);

            await tx
                .insert(countryAnthems)
                .values({
                    mapId,
                    countryId: id,
                    name: anthemInput.name,
                    path: anthemPath,
                })
                .onConflictDoUpdate({
                    target: [countryAnthems.mapId, countryAnthems.countryId],
                    set: {
                        name: anthemInput.name,
                        path: anthemPath,
                    },
                });
        }

        const states = await tx
            .select()
            .from(countryStates)
            .where(and(eq(countryStates.countryId, id), eq(countryStates.mapId, mapId)));

        const names = await tx
            .select({
                commonName: countryNames.commonName,
                officialName: countryNames.officialName,
            })
            .from(countryNames)
            .where(and(eq(countryNames.countryId, id), eq(countryNames.mapId, mapId)));

        const flagData = await loadFile(flagPath);
        const coatOfArmsData = await loadFile(coatOfArmsPath);
        const anthemData = await loadFile(anthemPath);

        return {
            ...updatedCountry,
            name: {
                common: names[0].commonName,
                official: names[0].officialName,
            },
            states: states.map((state) => state.stateId),
            flag: flagData,
            coatOfArms: coatOfArmsData,
            anthem: {
                name: anthemInput.name,
                url: anthemData,
            },
        };
    });
};
