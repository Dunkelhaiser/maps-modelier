import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetAlliances } from "@ipc/alliances";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { SortableTableHead, Table, TableBody, TableHeader } from "@ui/Table";
import { useState } from "react";
import { GetAlliancesInput } from "src/shared/schemas/alliances/getAlliances";
import AllianceRow from "./AllianceRow";
import AllianceRowCreate from "./AllianceRowCreate";

const Alliances = () => {
    const activeMap = useActiveMap();
    const mode = useMapStore((state) => state.mode);
    const [sortConfig, setSortConfig] = useState<GetAlliancesInput>({
        sortBy: "name",
        sortOrder: "asc",
    });
    const { data } = useGetAlliances(activeMap, sortConfig);

    return (
        <>
            <CardHeaderWithClose>
                <CardTitle className="text-xl">Alliances</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                <Table>
                    <TableHeader>
                        <SortableTableHead sortKey="name" sortConfig={sortConfig} setSortConfig={setSortConfig}>
                            Name
                        </SortableTableHead>
                        <SortableTableHead sortKey="type" sortConfig={sortConfig} setSortConfig={setSortConfig}>
                            Type
                        </SortableTableHead>
                        <SortableTableHead sortKey="members" sortConfig={sortConfig} setSortConfig={setSortConfig}>
                            Members
                        </SortableTableHead>
                        <SortableTableHead
                            alignItems="right"
                            sortKey="leader"
                            sortConfig={sortConfig}
                            setSortConfig={setSortConfig}
                        >
                            Leader
                        </SortableTableHead>
                    </TableHeader>
                    <TableBody>
                        {mode === "editing" && <AllianceRowCreate />}
                        {data?.map((alliance) => <AllianceRow alliance={alliance} key={alliance.id} />)}
                    </TableBody>
                </Table>
            </CardContent>
        </>
    );
};
export default Alliances;
