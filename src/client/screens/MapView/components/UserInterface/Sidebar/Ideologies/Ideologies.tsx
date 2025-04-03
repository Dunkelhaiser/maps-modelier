import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetAllIdeologies } from "@ipc/ideologies";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { SortableTableHead, Table, TableBody, TableHead, TableHeader } from "@ui/Table";
import { useState } from "react";
import { GetIdeologiesInput } from "src/shared/schemas/ideologies/getIdeologies";
import IdeologyRow from "./IdeologyRow";
import IdeologyRowCreate from "./IdeologyRowCreate";

const Ideologies = () => {
    const activeMap = useActiveMap();
    const mode = useMapStore((state) => state.mode);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);
    const [sortConfig, setSortConfig] = useState<GetIdeologiesInput>({
        sortBy: "name",
        sortOrder: "asc",
    });
    const { data } = useGetAllIdeologies(activeMap, sortConfig);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">Ideologies</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableHead className="w-0" />
                        <SortableTableHead sortKey="name" sortConfig={sortConfig} setSortConfig={setSortConfig}>
                            Name
                        </SortableTableHead>
                        {mode !== "viewing" && <TableHead className="text-right">Actions</TableHead>}
                    </TableHeader>
                    <TableBody>
                        {mode !== "viewing" && <IdeologyRowCreate mapId={activeMap} />}
                        {data?.map((ideology) => (
                            <IdeologyRow ideology={ideology} mapId={activeMap} key={ideology.id} />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </>
    );
};
export default Ideologies;
