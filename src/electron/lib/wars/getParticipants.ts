import { eq, and, inArray, not } from "drizzle-orm";
import { IpcMainInvokeEvent } from "electron";
import { WarParticipantGroup } from "../../../shared/types.js";
import { db } from "../../db/db.js";
import { warSides, warParticipants, wars, alliances, allianceMembers } from "../../db/schema.js";
import { getCountryBase } from "../countries/getCountryBase.js";

export const getParticipants = async (_event: IpcMainInvokeEvent, mapId: string, id: number) => {
    const existingWar = await db
        .select({ id: wars.id })
        .from(wars)
        .where(and(eq(wars.mapId, mapId), eq(wars.id, id)));

    if (existingWar.length === 0) throw new Error("War not found");

    const sides = await db
        .select()
        .from(warSides)
        .where(and(eq(warSides.mapId, mapId), eq(warSides.warId, id)));

    const sidesWithParticipants = await Promise.all(
        sides.map(async (side) => {
            const participants = await db
                .select({
                    countryId: warParticipants.countryId,
                })
                .from(warParticipants)
                .where(
                    and(
                        eq(warParticipants.mapId, mapId),
                        eq(warParticipants.warId, id),
                        eq(warParticipants.sideId, side.id)
                    )
                );

            const participantCountryIds = participants.map((p) => p.countryId);

            const countriesBase = await Promise.all(
                participants.map(async (participant) => {
                    return await getCountryBase(mapId, participant.countryId);
                })
            );

            const militaryAlliances = await db
                .select({
                    id: alliances.id,
                    name: alliances.name,
                    leader: alliances.leader,
                })
                .from(alliances)
                .innerJoin(
                    allianceMembers,
                    and(
                        eq(allianceMembers.mapId, alliances.mapId),
                        eq(allianceMembers.allianceId, alliances.id),
                        inArray(allianceMembers.countryId, participantCountryIds)
                    )
                )
                .where(and(eq(alliances.mapId, mapId), eq(alliances.type, "military")))
                .groupBy(alliances.id);

            const allianceMemberships = await db
                .select({
                    countryId: allianceMembers.countryId,
                    allianceId: allianceMembers.allianceId,
                })
                .from(allianceMembers)
                .innerJoin(
                    alliances,
                    and(
                        eq(alliances.mapId, allianceMembers.mapId),
                        eq(alliances.id, allianceMembers.allianceId),
                        eq(alliances.type, "military")
                    )
                )
                .where(
                    and(eq(allianceMembers.mapId, mapId), inArray(allianceMembers.countryId, participantCountryIds))
                );

            const countryAlliancesMap = new Map<number, number[]>();
            for (const membership of allianceMemberships) {
                if (!countryAlliancesMap.has(membership.countryId)) {
                    countryAlliancesMap.set(membership.countryId, []);
                }
                countryAlliancesMap.get(membership.countryId)!.push(membership.allianceId);
            }

            const groupedParticipants: WarParticipantGroup[] = [];

            for (const alliance of militaryAlliances) {
                const allianceCountries = countriesBase
                    .filter((country) => {
                        const allianceIds = countryAlliancesMap.get(country.id);
                        return allianceIds?.includes(alliance.id);
                    })
                    .map((country) => ({
                        ...country,
                        allianceId: alliance.id,
                    }));

                if (allianceCountries.length > 0) {
                    const nonParticipatingMemberIds = await db
                        .select({
                            countryId: allianceMembers.countryId,
                        })
                        .from(allianceMembers)
                        .where(
                            and(
                                eq(allianceMembers.mapId, mapId),
                                eq(allianceMembers.allianceId, alliance.id),
                                not(inArray(allianceMembers.countryId, participantCountryIds))
                            )
                        );

                    const nonParticipatingCountries = await Promise.all(
                        nonParticipatingMemberIds.map(async (member) => {
                            const country = await getCountryBase(mapId, member.countryId);
                            return {
                                ...country,
                                allianceId: alliance.id,
                            };
                        })
                    );

                    groupedParticipants.push({
                        id: alliance.id,
                        name: alliance.name,
                        leader: alliance.leader,
                        countries: allianceCountries,
                        nonParticipatingCountries,
                        participantCount: allianceCountries.length,
                    });
                }
            }

            const nonAlliedCountries = countriesBase
                .filter((country) => !countryAlliancesMap.has(country.id))
                .map((country) => ({
                    ...country,
                    allianceId: null,
                }));

            if (nonAlliedCountries.length > 0) {
                groupedParticipants.push({
                    id: null,
                    name: "Independent Countries",
                    leader: null as number | null,
                    countries: nonAlliedCountries,
                    nonParticipatingCountries: [],
                    participantCount: nonAlliedCountries.length,
                });
            }

            const uniqueParticipantCount = participantCountryIds.length;

            return {
                id: side.id,
                name: side.side,
                participantCount: uniqueParticipantCount,
                allianceGroups: groupedParticipants,
                totalGroups: groupedParticipants.length,
            };
        })
    );

    const totalUniqueParticipants = sidesWithParticipants.reduce((total, side) => total + side.participantCount, 0);

    return {
        sides: sidesWithParticipants,
        totalParticipants: totalUniqueParticipants,
        totalGroups: sidesWithParticipants.reduce((total, side) => total + side.totalGroups, 0),
    };
};
