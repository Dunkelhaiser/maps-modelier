import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetAllEthnicities } from "@ipc/ethnicities";
import { useSidebarStore } from "@store/sidebar";
import { CardContent, CardTitle } from "@ui/Card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@ui/Table";
import EthnicityRow from "./EthnicityRow";
import EthnicityRowCreate from "./EthnicityRowCreate";

const Ethnicities = () => {
    const activeMap = useActiveMap();
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);
    const { data } = useGetAllEthnicities(activeMap.id);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">Ethnicities</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-card">
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Total Number</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <EthnicityRowCreate mapId={activeMap.id} />
                        {data?.map((ethnicity) => (
                            <EthnicityRow ethnicity={ethnicity} mapId={activeMap.id} key={ethnicity.id} />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </>
    );
};
export default Ethnicities;
