import { eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { maps } from "../../db/schema.js";

export const deleteMap = async (_: Electron.IpcMainInvokeEvent, id: string) => {
    await db.delete(maps).where(eq(maps.id, id));
};
