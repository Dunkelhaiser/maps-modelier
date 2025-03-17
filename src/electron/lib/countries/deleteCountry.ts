import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { alliances, countries } from "../../db/schema.js";
import { deleteFolder } from "../utils/deleteFolder.js";

export const deleteCountry = async (_: Electron.IpcMainInvokeEvent, mapId: string, tag: string) => {
    const alliance = await db
        .select()
        .from(alliances)
        .where(and(eq(alliances.mapId, mapId), eq(alliances.leader, tag)));

    if (alliance.length) {
        throw new Error(`Cannot delete a country that is the leader of an alliance (${alliance[0].name})`);
    }

    await db.delete(countries).where(and(eq(countries.mapId, mapId), eq(countries.tag, tag)));
    await deleteFolder(tag, ["media", mapId]);
};
