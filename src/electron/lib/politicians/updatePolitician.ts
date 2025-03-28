import path from "path";
import { and, eq, getTableColumns } from "drizzle-orm";
import { PoliticianInput, politicianSchema } from "../../../shared/schemas/politics/politician.js";
import { db } from "../../db/db.js";
import { politicians } from "../../db/schema.js";
import { deleteFile } from "../utils/deleteFile.js";
import { loadFile } from "../utils/loadFile.js";
import { saveFile } from "../utils/saveFile.js";

export const updatePolitician = async (
    _: Electron.IpcMainInvokeEvent,
    mapId: string,
    id: number,
    data: PoliticianInput
) => {
    const { mapId: mapIdCol, countryId, createdAt, updatedAt, ...cols } = getTableColumns(politicians);
    const parsedData = await politicianSchema.parseAsync(data);

    const existingPolitician = await db
        .select()
        .from(politicians)
        .where(and(eq(politicians.id, id), eq(politicians.mapId, mapId)));

    if (existingPolitician.length === 0) throw new Error(`Politician not found`);

    const politicianFolder = ["media", mapId, `${existingPolitician[0].countryId}`, "politicians", `${id}`];

    let portraitPath: string | null = null;
    if (parsedData.portrait) {
        if (existingPolitician[0].portrait) {
            const portraitFile = path.basename(existingPolitician[0].portrait);
            await deleteFile(portraitFile, politicianFolder);
        }
        portraitPath = await saveFile(parsedData.portrait, "portrait", politicianFolder);

        await db
            .update(politicians)
            .set({ portrait: portraitPath })
            .where(and(eq(politicians.id, id), eq(politicians.mapId, mapId)));
    }

    const [updatedPolitician] = await db
        .update(politicians)
        .set({ name: parsedData.name })
        .where(and(eq(politicians.id, id), eq(politicians.mapId, mapId)))
        .returning(cols);

    const portraitData = await loadFile(portraitPath ?? "");

    return {
        ...updatedPolitician,
        portrait: portraitData,
    };
};
