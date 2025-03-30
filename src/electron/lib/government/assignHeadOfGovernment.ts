import { and, eq } from "drizzle-orm";
import { AssignHeadInput, assignHeadSchema } from "../../../shared/schemas/politics/assignHead.js";
import { db } from "../../db/db.js";
import { headsOfGovernment } from "../../db/schema.js";
import { checkCountryExistence } from "../countries/checkCountryExistance.js";

export const assignHeadOfGovernment = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    countryId: number,
    data: AssignHeadInput
) => {
    const { head, ...parsedData } = await assignHeadSchema.parseAsync(data);

    await db.transaction(async (tx) => {
        await checkCountryExistence(mapId, countryId, tx);

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
