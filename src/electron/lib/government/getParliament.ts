import { and, count, eq, sum } from "drizzle-orm";
import { Politician } from "../../../shared/types.js";
import { db } from "../../db/db.js";
import { parliamentSeats, parliaments } from "../../db/schema.js";
import { getPolitician } from "../politicians/getPolitician.js";

export const getParliament = async (_: Electron.IpcMainInvokeEvent, mapId: string, countryId: number) => {
    const parliament = await db
        .select({
            id: parliaments.id,
            name: parliaments.name,
            seatsNumber: parliaments.seatsNumber,
            coalitionLeaderId: parliaments.coalitionLeaderId,
            oppositionLeaderId: parliaments.oppositionLeaderId,
        })
        .from(parliaments)
        .where(and(eq(parliaments.mapId, mapId), eq(parliaments.countryId, countryId)));

    if (parliament.length === 0) throw new Error(`Parliament not found for this country`);

    const [parliamentData] = parliament;
    const parliamentId = parliamentData.id;

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

    const [coalitionSeats] = await db
        .select({ totalSeats: sum(parliamentSeats.seats).mapWith(Number) })
        .from(parliamentSeats)
        .where(
            and(
                eq(parliamentSeats.mapId, mapId),
                eq(parliamentSeats.parliamentId, parliamentId),
                eq(parliamentSeats.side, "ruling_coalition")
            )
        );

    const [oppositionSeats] = await db
        .select({ totalSeats: sum(parliamentSeats.seats).mapWith(Number) })
        .from(parliamentSeats)
        .where(
            and(
                eq(parliamentSeats.mapId, mapId),
                eq(parliamentSeats.parliamentId, parliamentId),
                eq(parliamentSeats.side, "opposition")
            )
        );

    const [neutralSeats] = await db
        .select({ totalSeats: sum(parliamentSeats.seats).mapWith(Number) })
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
        id: parliamentId,
        name: parliamentData.name,
        seatsNumber: parliamentData.seatsNumber,
        coalitionLeader,
        oppositionLeader,
        coalition: {
            count: coalitionCount.count,
            seats: coalitionSeats.totalSeats,
        },
        neutral: {
            count: neutralCount.count,
            seats: neutralSeats.totalSeats,
        },
        opposition: {
            count: oppositionCount.count,
            seats: oppositionSeats.totalSeats,
        },
    };
};
