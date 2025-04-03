import { eq } from "drizzle-orm";
import { GetIdeologiesInput, getIdeologiesSchema } from "../../../shared/schemas/ideologies/getIdeologies.js";
import { db } from "../../db/db.js";
import { ideologies } from "../../db/schema.js";
import { orderBy } from "../utils/orderBy.js";

export const getAllIdeologies = async (_: Electron.IpcMainInvokeEvent, mapId: string, query?: GetIdeologiesInput) => {
    const { sortOrder } = await getIdeologiesSchema.parseAsync(query);

    const orderQuery = orderBy(ideologies.name, sortOrder);

    const ideologiesArr = await db
        .select({
            id: ideologies.id,
            name: ideologies.name,
            color: ideologies.color,
        })
        .from(ideologies)
        .where(eq(ideologies.mapId, mapId))
        .orderBy(orderQuery);

    return ideologiesArr;
};
