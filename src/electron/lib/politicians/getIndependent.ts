import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../db/db.js";
import { politicians, partyMembers } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";

export const getIndependent = async (_: Electron.IpcMainInvokeEvent, mapId: string, countryId: number) => {
    const independentPoliticians = await db
        .select({
            id: politicians.id,
            name: politicians.name,
            portrait: politicians.portrait,
        })
        .from(politicians)
        .leftJoin(
            partyMembers,
            and(eq(partyMembers.politicianId, politicians.id), eq(partyMembers.mapId, politicians.mapId))
        )
        .where(
            and(eq(politicians.mapId, mapId), eq(politicians.countryId, countryId), isNull(partyMembers.politicianId))
        )
        .orderBy(politicians.name);

    const processedData = await Promise.all(
        independentPoliticians.map(async (politician) => {
            let portraitData: string | null = null;
            if (politician.portrait) portraitData = await loadFile(politician.portrait);

            return {
                id: politician.id,
                name: politician.name,
                portrait: portraitData,
                party: null,
            };
        })
    );

    return processedData;
};
