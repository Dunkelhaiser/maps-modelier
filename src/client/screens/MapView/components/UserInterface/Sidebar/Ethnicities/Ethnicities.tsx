import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetAllEthnicities } from "@ipc/ethnicities";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@ui/Table";
import EthnicityRow from "./EthnicityRow";
import EthnicityRowCreate from "./EthnicityRowCreate";

const Ethnicities = () => {
    const activeMap = useActiveMap();
    const mode = useMapStore((state) => state.mode);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);
    const { data } = useGetAllEthnicities(activeMap);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">Ethnicities</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-card">
                            <TableHead className="w-0" />
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Total Number</TableHead>
                            {mode !== "viewing" && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
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
