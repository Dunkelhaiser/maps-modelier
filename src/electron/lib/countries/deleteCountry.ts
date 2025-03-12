import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { countries } from "../../db/schema.js";
import { deleteFolder } from "../utils/deleteFolder.js";

export const deleteCountry = async (_: Electron.IpcMainInvokeEvent, mapId: string, tag: string) => {
    await db.delete(countries).where(and(eq(countries.mapId, mapId), eq(countries.tag, tag)));
    await deleteFolder(tag, ["media", mapId]);
};
