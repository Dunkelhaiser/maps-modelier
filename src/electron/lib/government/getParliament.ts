import { and, count, eq } from "drizzle-orm";
import { Politician } from "../../../shared/types.js";
import { db } from "../../db/db.js";
import { parliamentSeats, parliaments } from "../../db/schema.js";
import { getPolitician } from "../politicians/getPolitician.js";

export const getParliament = async (_: Electron.IpcMainInvokeEvent, mapId: string, parliamentId: number) => {
    const parliament = await db
        .select({
            id: parliaments.id,
            name: parliaments.name,
            seatsNumber: parliaments.seatsNumber,
            coalitionLeaderId: parliaments.coalitionLeaderId,
            oppositionLeaderId: parliaments.oppositionLeaderId,
        })
        .from(parliaments)
        .where(and(eq(parliaments.mapId, mapId), eq(parliaments.id, parliamentId)));

    if (parliament.length === 0) throw new Error(`Parliament not found`);

    const [parliamentData] = parliament;

    const [coalitionCount] = await db
        .select({ count: count() })
        .from(parliamentSeats)
        .where(
            and(
                eq(parliamentSeats.mapId, mapId),
                eq(parliamentSeats.parliamentId, parliamentId),
                eq(parliamentSeats.side, "ruling_coalition")
            )
        );

    const [oppositionCount] = await db
        .select({ count: count() })
        .from(parliamentSeats)
        .where(
            and(
                eq(parliamentSeats.mapId, mapId),
                eq(parliamentSeats.parliamentId, parliamentId),
                eq(parliamentSeats.side, "opposition")
            )
        );

    const [neutralCount] = await db
        .select({ count: count() })
        .from(parliamentSeats)
        .where(
            and(
                eq(parliamentSeats.mapId, mapId),
                eq(parliamentSeats.parliamentId, parliamentId),
                eq(parliamentSeats.side, "neutral")
            )
        );

    let coalitionLeader: Politician | null = null,
        oppositionLeader: Politician | null = null;

    if (parliamentData.coalitionLeaderId)
        coalitionLeader = await getPolitician(_, mapId, parliamentData.coalitionLeaderId);

    if (parliamentData.oppositionLeaderId)
        oppositionLeader = await getPolitician(_, mapId, parliamentData.oppositionLeaderId);

    return {
        id: parliamentData.id,
        name: parliamentData.name,
        seatsNumber: parliamentData.seatsNumber,
        coalitionLeader,
        oppositionLeader,
        coalitionCount: coalitionCount.count,
        oppositionCount: oppositionCount.count,
        neutralCount: neutralCount.count,
    };
};
