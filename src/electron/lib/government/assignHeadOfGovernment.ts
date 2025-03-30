import { and, eq } from "drizzle-orm";
import { AssignHeadInput, assignHeadSchema } from "../../../shared/schemas/politics/assignHead.js";
import { db } from "../../db/db.js";
import { headsOfGovernment, countries } from "../../db/schema.js";

export const assignHeadOfGovernment = async (
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
            .select({ id: headsOfGovernment.politicianId })
            .from(headsOfGovernment)
            .where(and(eq(headsOfGovernment.mapId, mapId), eq(headsOfGovernment.countryId, countryId)));

        if (existingHead.length > 0) {
            await tx
                .delete(headsOfGovernment)
                .where(and(eq(headsOfGovernment.mapId, mapId), eq(headsOfGovernment.countryId, countryId)));
        }

        await tx.insert(headsOfGovernment).values({
            mapId,
            countryId,
            politicianId: head,
            ...parsedData,
        });
    });
};
