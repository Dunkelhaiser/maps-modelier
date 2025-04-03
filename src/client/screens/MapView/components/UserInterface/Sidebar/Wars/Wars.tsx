import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetWars } from "@ipc/wars";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { SortableTableHead, Table, TableBody, TableHeader } from "@ui/Table";
import { useState } from "react";
import { GetIdeologiesInput } from "src/shared/schemas/ideologies/getIdeologies";
import WarRow from "./WarRow";
import WarRowCreate from "./WarRowCreate";

const Wars = () => {
    const activeMap = useActiveMap();
    const mode = useMapStore((state) => state.mode);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);
    const [sortConfig, setSortConfig] = useState<GetIdeologiesInput>({
        sortBy: "name",
        sortOrder: "asc",
    });
    const { data: wars } = useGetWars(activeMap);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">Wars</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                <Table>
                    <TableHeader>
                        <SortableTableHead sortKey="name" sortConfig={sortConfig} setSortConfig={setSortConfig}>
                            Name
                        </SortableTableHead>
                        <SortableTableHead sortKey="participants" sortConfig={sortConfig} setSortConfig={setSortConfig}>
                            Participants
                        </SortableTableHead>
                        <SortableTableHead sortKey="aggressor" sortConfig={sortConfig} setSortConfig={setSortConfig}>
                            Aggressor
                        </SortableTableHead>
                        <SortableTableHead
                            alignItems="right"
                            sortKey="defender"
                            sortConfig={sortConfig}
                            setSortConfig={setSortConfig}
                        >
                            Defender
                        </SortableTableHead>
                    </TableHeader>
                    <TableBody>
                        {mode === "editing" && <WarRowCreate />}
                        {wars?.map((war) => <WarRow war={war} key={war.id} />)}
                    </TableBody>
                </Table>
            </CardContent>
        </>
    );
};
export default Wars;
