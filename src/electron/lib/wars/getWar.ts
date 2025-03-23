import { eq, getTableColumns, count, and } from "drizzle-orm";
import { IpcMainInvokeEvent } from "electron";
import { db } from "../../db/db.js";
import { wars, warSides, warParticipants } from "../../db/schema.js";
import { getCountryBase } from "../countries/getCountryBase.js";

export const getWar = async (_event: IpcMainInvokeEvent, mapId: string, id: number) => {
    const { mapId: mapIdCol, createdAt, updatedAt, ...cols } = getTableColumns(wars);

    const war = await db
        .select(cols)
        .from(wars)
        .where(and(eq(wars.mapId, mapId), eq(wars.id, id)));

    if (war.length === 0) throw new Error("War not found");

    const [warData] = war;

    const attackerData = await getCountryBase(mapId, warData.aggressor);
    const defenderData = await getCountryBase(mapId, warData.defender);

    const sidesArr = await db
        .select()
        .from(warSides)
        .where(and(eq(warSides.mapId, mapId), eq(warSides.warId, warData.id)));

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
                        eq(warParticipants.warId, warData.id),
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
        ...warData,
        aggressor: attackerData,
        defender: defenderData,
        sides,
        totalParticipants,
    };
};
