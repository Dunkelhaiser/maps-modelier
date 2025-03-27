import { eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { ideologies } from "../../db/schema.js";

export const getAllIdeologies = async (_: Electron.IpcMainInvokeEvent, mapId: string) => {
    const ideologiesArr = await db
        .select({
            id: ideologies.id,
            name: ideologies.name,
            color: ideologies.color,
        })
        .from(ideologies)
        .where(eq(ideologies.mapId, mapId))
        .orderBy(ideologies.name);

    return ideologiesArr;
};
