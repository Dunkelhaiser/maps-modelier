import { and, eq, getTableColumns } from "drizzle-orm";
import { IpcMainInvokeEvent } from "electron";
import { CreateWarInput, createWarSchema } from "../../../shared/schemas/wars/createWar.js";
import { db } from "../../db/db.js";
import { wars, warSides, warParticipants, countries, countryNames, countryFlags } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const createWar = async (_event: IpcMainInvokeEvent, mapId: string, data: CreateWarInput) => {
    const validatedData = await createWarSchema.parseAsync(data);
    const { mapId: mapIdCol, createdAt, updatedAt, ...cols } = getTableColumns(wars);

    return db.transaction(async (tx) => {
        const [war] = await tx
            .insert(wars)
            .values({
                mapId,
                ...validatedData,
            })
            .returning(cols);

        const [attackerSide] = await tx
            .insert(warSides)
            .values({
                warId: war.id,
                side: "attacker",
                mapId,
            })
            .returning();

        const [defenderSide] = await tx
            .insert(warSides)
            .values({
                warId: war.id,
                side: "defender",
                mapId,
            })
            .returning();

        await tx.insert(warParticipants).values({
            sideId: attackerSide.id,
            warId: war.id,
            countryId: data.aggressor,
            mapId,
        });

        await tx.insert(warParticipants).values({
            sideId: defenderSide.id,
            warId: war.id,
            countryId: data.defender,
            mapId,
        });

        const [defenderData] = await tx
            .select({
                id: countries.id,
                name: countryNames.commonName,
                flag: countryFlags.path,
            })
            .from(countries)
            .innerJoin(
                countryNames,
                and(eq(countries.id, countryNames.countryId), eq(countries.mapId, countryNames.mapId))
            )
            .innerJoin(
                countryFlags,
                and(eq(countries.id, countryFlags.countryId), eq(countries.mapId, countryFlags.mapId))
            )
            .where(and(eq(countries.id, data.defender), eq(countries.mapId, mapId)));

        const [attackerData] = await tx
            .select({
                id: countries.id,
                name: countryNames.commonName,
                flag: countryFlags.path,
            })
            .from(countries)
            .innerJoin(
                countryNames,
                and(eq(countries.id, countryNames.countryId), eq(countries.mapId, countryNames.mapId))
            )
            .innerJoin(
                countryFlags,
                and(eq(countries.id, countryFlags.countryId), eq(countries.mapId, countryFlags.mapId))
            )
            .where(and(eq(countries.id, data.aggressor), eq(countries.mapId, mapId)));

        const defenderFlag = await loadFile(defenderData.flag);
        const attackerFlag = await loadFile(attackerData.flag);

        return {
            ...war,
            aggressor: {
                id: attackerData.id,
                name: attackerData.name,
                flag: attackerFlag,
            },
            defender: {
                id: defenderData.id,
                name: defenderData.name,
                flag: defenderFlag,
            },
        };
    });
};
