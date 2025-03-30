import { and, eq } from "drizzle-orm";
import { AssignHeadInput, assignHeadSchema } from "../../../shared/schemas/politics/assignHead.js";
import { db } from "../../db/db.js";
import { headsOfState, countries } from "../../db/schema.js";

export const assignHeadOfState = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    countryId: number,
    data: AssignHeadInput
) => {
    const { head, ...parsedData } = await assignHeadSchema.parseAsync(data);

    await db.transaction(async (tx) => {
        const country = await tx
            .select({ id: countries.id })
            .from(countries)
            .where(and(eq(countries.mapId, mapId), eq(countries.id, countryId)));

        if (country.length === 0) throw new Error("Country does not exist");

        const existingHead = await tx
            .select({ id: headsOfState.politicianId })
            .from(headsOfState)
            .where(and(eq(headsOfState.mapId, mapId), eq(headsOfState.countryId, countryId)));

        if (existingHead.length > 0) {
            await tx
                .delete(headsOfState)
                .where(and(eq(headsOfState.mapId, mapId), eq(headsOfState.countryId, countryId)));
        }

        await tx.insert(headsOfState).values({
            mapId,
            countryId,
            politicianId: head,
            ...parsedData,
        });
    });
};
