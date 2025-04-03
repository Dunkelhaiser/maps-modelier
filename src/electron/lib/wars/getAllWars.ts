import { eq, getTableColumns, count, and } from "drizzle-orm";
import { IpcMainInvokeEvent } from "electron";
import { GetWarsInput, getWarsSchema } from "../../../shared/schemas/wars/getWars.js";
import { db } from "../../db/db.js";
import { wars, warSides, warParticipants } from "../../db/schema.js";
import { getCountryBase } from "../countries/getCountryBase.js";
import { orderBy } from "../utils/orderBy.js";

export const getAllWars = async (_event: IpcMainInvokeEvent, mapId: string, query?: GetWarsInput) => {
    const { mapId: mapIdCol, createdAt, updatedAt, ...cols } = getTableColumns(wars);
    const { sortBy, sortOrder } = await getWarsSchema.parseAsync(query);

    const sortOptions = {
        name: wars.name,
        aggressor: wars.aggressor,
        defender: wars.defender,
        participants: count(warParticipants.countryId),
    };

    const orderQuery = orderBy(sortOptions[sortBy], sortOrder);

    const warsArr = await db.select(cols).from(wars).where(eq(wars.mapId, mapId)).orderBy(orderQuery);

    const warsData = await Promise.all(
        warsArr.map(async (war) => {
            const attackerData = await getCountryBase(mapId, war.aggressor);
            const defenderData = await getCountryBase(mapId, war.defender);

            const sidesArr = await db
                .select()
                .from(warSides)
                .where(and(eq(warSides.mapId, mapId), eq(warSides.warId, war.id)));

            const sides = await Promise.all(
                sidesArr.map(async (side) => {
                    const [participantCount] = await db
                        .select({
                            count: count(),
                        })
                        .from(warParticipants)
                        .where(
                            and(
                                eq(warParticipants.mapId, mapId),
                                eq(warParticipants.warId, war.id),
                                eq(warParticipants.sideId, side.id)
                            )
                        );

                    return {
                        id: side.id,
                        name: side.side,
                        participantCount: participantCount.count,
                    };
                })
            );

            const totalParticipants = sides.reduce((total, side) => total + side.participantCount, 0);

            return {
                ...war,
                aggressor: attackerData,
                defender: defenderData,
                sides,
                totalParticipants,
            };
        })
    );

    return warsData;
};
