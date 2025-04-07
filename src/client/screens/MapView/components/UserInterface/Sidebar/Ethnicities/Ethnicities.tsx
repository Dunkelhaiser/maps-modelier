import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetAllEthnicities } from "@ipc/ethnicities";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { SortableTableHead, Table, TableBody, TableHead, TableHeader } from "@ui/Table";
import { useState } from "react";
import { GetEthnicitiesInput } from "src/shared/schemas/ethnicities/getEthnicities";
import EthnicityRow from "./EthnicityRow";
import EthnicityRowCreate from "./EthnicityRowCreate";

const Ethnicities = () => {
    const activeMap = useActiveMap();
    const mode = useMapStore((state) => state.mode);
    const [sortConfig, setSortConfig] = useState<GetEthnicitiesInput>({
        sortBy: "name",
        sortOrder: "asc",
    });
    const { data } = useGetAllEthnicities(activeMap, sortConfig);

    return (
        <>
            <CardHeaderWithClose>
                <CardTitle className="text-xl">Ethnicities</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableHead className="w-0" />
                        <SortableTableHead sortKey="name" sortConfig={sortConfig} setSortConfig={setSortConfig}>
                            Name
                        </SortableTableHead>
                        <SortableTableHead
                            alignItems="right"
                            sortKey="population"
                            sortConfig={sortConfig}
                            setSortConfig={setSortConfig}
                        >
                            Total Number
                        </SortableTableHead>
                        {mode !== "viewing" && <TableHead className="text-right">Actions</TableHead>}
                    </TableHeader>
                    <TableBody>
                        {mode !== "viewing" && <EthnicityRowCreate mapId={activeMap} />}
                        {data?.map((ethnicity) => (
                            <EthnicityRow ethnicity={ethnicity} mapId={activeMap} key={ethnicity.id} />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </>
    );
};
export default Ethnicities;
