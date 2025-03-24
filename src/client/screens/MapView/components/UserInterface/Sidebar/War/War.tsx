import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetWar, useGetParticipants } from "@ipc/wars";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { Separator } from "@ui/Separator";
import { Table, TableBody, TableHead, TableHeader } from "@ui/Table";
import { Flag, Timer, Users, Shield } from "lucide-react";
import WarParticipantRow from "./WarParticipantRow";

const War = () => {
    const activeMap = useActiveMap();
    const selectedWar = useMapStore((state) => state.selectedWar)!;
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);
    const selectCountry = useMapStore((state) => state.selectCountry);
    const selectAlliance = useMapStore((state) => state.selectAlliance);

    const { data: war } = useGetWar(activeMap, selectedWar);
    const { data: participants } = useGetParticipants(activeMap, selectedWar);

    if (!war || !participants) {
        return <p className="p-4 text-center">Loading war data...</p>;
    }

    const startDate = new Date(war.startedAt).toLocaleDateString();
    const endDate = war.endedAt ? new Date(war.endedAt).toLocaleDateString() : "Ongoing";

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">{war.name}</CardTitle>
            </CardHeaderWithClose>

            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-4 overflow-auto pb-6">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3 rounded-md bg-muted p-3 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-muted-foreground/10 p-2">
                                <Flag className="size-4 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Aggressor</p>
                                <button
                                    type="button"
                                    className="mt-1 flex items-center gap-2"
                                    onClick={() => selectCountry(war.aggressor.id)}
                                >
                                    <img
                                        src={war.aggressor.flag}
                                        alt={`Flag of ${war.aggressor.name}`}
                                        className="aspect-[3/2] h-6 rounded-md border border-border object-cover"
                                    />
                                    <p className="font-medium">{war.aggressor.name}</p>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-muted-foreground/10 p-2">
                                <Flag className="size-4 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Defender</p>
                                <button
                                    type="button"
                                    className="mt-1 flex items-center gap-2"
                                    onClick={() => selectCountry(war.defender.id)}
                                >
                                    <img
                                        src={war.defender.flag}
                                        alt={`Flag of ${war.defender.name}`}
                                        className="aspect-[3/2] h-6 rounded-md border border-border object-cover"
                                    />
                                    <p className="font-medium">{war.defender.name}</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-md bg-muted p-3 shadow-sm">
                        <div className="rounded-full bg-muted-foreground/10 p-2">
                            <Timer className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="font-medium">
                                {startDate} - {endDate}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-md bg-muted p-3 shadow-sm">
                        <div className="rounded-full bg-muted-foreground/10 p-2">
                            <Users size={16} className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Participants</p>
                            <p className="font-medium">{participants.totalParticipants}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    <h3 className="mb-2 text-lg font-semibold">Participants</h3>

                    {participants.sides.map((side, index) => (
                        <div key={side.id} className="mb-6">
                            <div className="mb-2 flex items-center justify-between">
                                <h4 className="font-medium capitalize">{side.name}</h4>
                                <span className="text-sm text-muted-foreground">
                                    {side.participantCount} {side.participantCount === 1 ? "country" : "countries"}
                                </span>
                            </div>

                            {side.allianceGroups.map((group) => (
                                <div key={group.id ?? "independent"} className="mb-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        {group.id !== null ? (
                                            <>
                                                <Shield className="size-4" />
                                                <button
                                                    type="button"
                                                    className="text-sm font-medium"
                                                    onClick={() => selectAlliance(group.id)}
                                                >
                                                    {group.name}
                                                </button>
                                                <span className="text-xs text-muted-foreground">
                                                    {group.participantCount} participanting
                                                </span>
                                                {group.nonParticipatingCountries.length > 0 && (
                                                    <span className="text-xs text-muted-foreground">
                                                        • {group.nonParticipatingCountries.length} non-participating
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm font-medium">Independent Countries</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({group.participantCount}{" "}
                                                    {group.participantCount === 1 ? "country" : "countries"})
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <Table>
                                        <TableHeader>
                                            <TableHead className="w-14">Flag</TableHead>
                                            <TableHead>Country</TableHead>
                                            {group.id !== null && <TableHead className="text-right">Status</TableHead>}
                                        </TableHeader>
                                        <TableBody>
                                            {group.countries.map((participant) => (
                                                <WarParticipantRow
                                                    key={participant.id}
                                                    participant={participant}
                                                    isAllianceLeader={participant.id === group.leader}
                                                    showAllianceRole={group.id !== null}
                                                />
                                            ))}

                                            {group.nonParticipatingCountries.length > 0 && (
                                                <>
                                                    {group.nonParticipatingCountries.map((participant) => (
                                                        <WarParticipantRow
                                                            key={participant.id}
                                                            participant={participant}
                                                            isAllianceLeader={participant.id === group.leader}
                                                            showAllianceRole={group.id !== null}
                                                            isParticipating={false}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            ))}
                            {index < participants.sides.length - 1 && <Separator className="my-6" />}
                        </div>
                    ))}
                </div>
            </CardContent>
        </>
    );
};

export default War;
