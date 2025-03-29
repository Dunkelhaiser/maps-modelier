import CardHeaderWithClose from "@components/CardHeaderWithClose";
import InfoBlock from "@components/InfoBlock";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetAlliance, useGetMembers } from "@ipc/alliances";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { Table, TableBody, TableHead, TableHeader } from "@ui/Table";
import { Users, Crown } from "lucide-react";
import MemberRow from "./MemberRow";

const Alliance = () => {
    const activeMap = useActiveMap();
    const selectedAlliance = useMapStore((state) => state.selectedAlliance)!;
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);
    const selectCountry = useMapStore((state) => state.selectCountry);

    const { data: alliance } = useGetAlliance(activeMap, selectedAlliance);
    const { data: members = [] } = useGetMembers(activeMap, selectedAlliance);

    if (!alliance) {
        return <p className="p-4 text-center">Loading alliance data...</p>;
    }

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{alliance.name}</CardTitle>
                    <p className="text-sm font-medium text-muted-foreground">({alliance.type})</p>
                </div>
            </CardHeaderWithClose>

            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-4 overflow-auto pb-6">
                <div className="flex flex-col gap-3">
                    <InfoBlock Icon={Crown} label="Leader" color="text-amber-500">
                        <button
                            type="button"
                            className="mt-1 flex items-center gap-2"
                            onClick={() => selectCountry(alliance.leader.id)}
                        >
                            <img
                                src={alliance.leader.flag}
                                alt={`Flag of ${alliance.leader.name}`}
                                className="aspect-[3/2] h-6 rounded-md border border-border object-cover"
                            />
                            <p className="font-medium">{alliance.leader.name}</p>
                        </button>
                    </InfoBlock>
                    <InfoBlock Icon={Users} label="Member Count" value={alliance.membersCount.toLocaleString()} />
                </div>

                <div className="mt-2">
                    <h3 className="mb-2 text-lg font-semibold">Members</h3>

                    <Table>
                        <TableHeader>
                            <TableHead className="w-14">Flag</TableHead>
                            <TableHead>Country</TableHead>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <MemberRow key={member.id} member={member} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </>
    );
};

export default Alliance;
