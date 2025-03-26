import { and, eq, getTableColumns } from "drizzle-orm";
import { PoliticianInput, politicianSchema } from "../../../shared/schemas/politics/politician.js";
import { db } from "../../db/db.js";
import { politicians } from "../../db/schema.js";
import { loadFile } from "../utils/loadFile.js";
import { saveFile } from "../utils/saveFile.js";

export const createPolitician = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    countryId: number,
    input: PoliticianInput
) => {
    const { name, portrait } = await politicianSchema.parseAsync(input);
    const { mapId: mapIdCol, countryId: countryIdCol, createdAt, updatedAt, ...cols } = getTableColumns(politicians);

    return await db.transaction(async (tx) => {
        const [createdPolitician] = await tx
            .insert(politicians)
            .values({
                mapId,
                countryId,
                name,
            })
            .returning(cols);

        const politicianFolder = ["media", mapId, `${countryId}`, "politicians", `${createdPolitician.id}`];

        let portraitPath: string | null = null;
        if (portrait) portraitPath = await saveFile(portrait, "portrait", politicianFolder);

        await tx
            .update(politicians)
            .set({ portrait: portraitPath })
            .where(and(eq(politicians.id, createdPolitician.id), eq(politicians.mapId, mapId)));

        const portraitData = await loadFile(portraitPath ?? "");

        return {
            ...createdPolitician,
            portrait: portraitData,
        };
    });
};
