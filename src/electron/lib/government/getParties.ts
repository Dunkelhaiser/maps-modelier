import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { parliamentSeats, politicalParties } from "../../db/schema.js";
import { checkParliamentExistence } from "./checkParliamentExistence.js";

export const getParties = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    return await db.transaction(async (tx) => {
        await checkParliamentExistence(mapId, id, tx);

        const partySeats = await tx
            .select({
                side: parliamentSeats.side,
                seats: parliamentSeats.seats,
                party: {
                    id: politicalParties.id,
                    name: politicalParties.name,
                    color: politicalParties.color,
                    acronym: politicalParties.acronym,
                },
            })
            .from(parliamentSeats)
            .innerJoin(
                politicalParties,
                and(eq(parliamentSeats.partyId, politicalParties.id), eq(parliamentSeats.mapId, politicalParties.mapId))
            )
            .where(and(eq(parliamentSeats.mapId, mapId), eq(parliamentSeats.parliamentId, id)));

        const sides = ["ruling_coalition", "neutral", "opposition"] as const;

        return sides.map((sideType) => ({
            side: sideType,
            parties: partySeats
                .filter((partySeat) => partySeat.side === sideType)
                .map((partySeat) => ({
                    ...partySeat.party,
                    seats: partySeat.seats,
                })),
        }));
    });
};
