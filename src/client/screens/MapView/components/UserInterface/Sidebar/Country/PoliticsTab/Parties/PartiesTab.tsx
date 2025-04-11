import { useActiveMap } from "@hooks/useActiveMap";
import { useGetParties } from "@ipc/parties";
import { useMapStore } from "@store/store";
import { SortableTableHead, Table, TableBody, TableHead, TableHeader } from "@ui/Table";
import { useState } from "react";
import { GetPartiesInput } from "src/shared/schemas/parties/getParties";
import PartyRow from "./PartyRow";
import PartyRowCreate from "./PartyRowCreate";

const PartiesTab = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const mode = useMapStore((state) => state.mode);
    const [sortConfig, setSortConfig] = useState<GetPartiesInput>({
        sortBy: "name",
        sortOrder: "asc",
    });
    const { data: parties = [] } = useGetParties(activeMap, selectedCountry, sortConfig);

    return (
        <Table>
            <TableHeader>
                <TableHead className="w-0" />
                <SortableTableHead sortKey="name" sortConfig={sortConfig} setSortConfig={setSortConfig}>
                    Name
                </SortableTableHead>
                <SortableTableHead sortKey="ideology" sortConfig={sortConfig} setSortConfig={setSortConfig}>
                    Ideology
                </SortableTableHead>

                <SortableTableHead
                    alignItems="right"
                    sortKey="members"
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                >
                    Members
                </SortableTableHead>
            </TableHeader>
            <TableBody>
                {mode === "editing" && <PartyRowCreate />}
                {parties.map((party) => (
                    <PartyRow party={party} key={party.id} />
                ))}
            </TableBody>
        </Table>
    );
};
export default PartiesTab;
