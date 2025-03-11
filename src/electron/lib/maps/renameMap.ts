import { eq } from "drizzle-orm";
import { RenameMapInput, renameMapSchema } from "../../../shared/schemas/maps/renameMap.js";
import { db } from "../../db/db.js";
import { maps } from "../../db/schema.js";

export const renameMap = async (_: Electron.IpcMainInvokeEvent, id: string, data: RenameMapInput) => {
    const { name } = await renameMapSchema.parseAsync(data);
    const renamedMap = await db.update(maps).set({ name }).where(eq(maps.id, id)).returning();
    return renamedMap.length > 0 ? renamedMap[0] : null;
};
