import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { politicalParties, politicians, headsOfGovernment, headsOfState } from "../../db/schema.js";
import { deleteFolder } from "../utils/deleteFolder.js";

export const deletePolitician = async (_: Electron.IpcMainInvokeEvent, mapId: string, id: number) => {
    const party = await db
        .select({ name: politicalParties.name })
        .from(politicalParties)
        .where(and(eq(politicalParties.mapId, mapId), eq(politicalParties.leaderId, id)));

    if (party.length) {
        throw new Error(`Cannot delete a politician that is the leader of a political party (${party[0].name})`);
    }

    const headOfState = await db
        .select({ politicianId: headsOfState.politicianId })
        .from(headsOfState)
        .where(and(eq(headsOfState.mapId, mapId), eq(headsOfState.politicianId, id)));

    if (headOfState.length) {
        throw new Error("Cannot delete a politician that is a head of state");
    }

    const headOfGovernment = await db
        .select({ politicianId: headsOfGovernment.politicianId })
        .from(headsOfGovernment)
        .where(and(eq(headsOfGovernment.mapId, mapId), eq(headsOfGovernment.politicianId, id)));

    if (headOfGovernment.length) {
        throw new Error("Cannot delete a politician that is a head of government");
    }

    const [politicianData] = await db
        .delete(politicians)
        .where(and(eq(politicians.mapId, mapId), eq(politicians.id, id)))
        .returning({ id: politicians.id, countryId: politicians.countryId });

    await deleteFolder(`${id}`, ["media", mapId, `${politicianData.countryId}`, "politicians", `${politicianData.id}`]);
};
