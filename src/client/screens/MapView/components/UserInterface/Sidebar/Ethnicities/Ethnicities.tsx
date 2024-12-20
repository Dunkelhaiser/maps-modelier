import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useGetAllEthnicities } from "@ipc/ethnicities";
import { useSidebarStore } from "@store/sidebar";
import { useAppStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@ui/Table";
import EthnicityRow from "./EthnicityRow";
import EthnicityRowCreate from "./EthnicityRowCreate";

const Ethnicities = () => {
    const activeMap = useAppStore((state) => state.activeMap)!;
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);
    const { data } = useGetAllEthnicities(activeMap.id);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">Ethnicities</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex flex-col gap-2">
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
