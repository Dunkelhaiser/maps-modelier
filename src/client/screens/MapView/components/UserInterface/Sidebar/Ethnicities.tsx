import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useGetAllEthnicities } from "@ipc/ethnicities";
import { useSidebarStore } from "@store/sidebar";
import { useAppStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/Table";

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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((ethnicity) => (
                            <TableRow key={ethnicity.id}>
                                <TableCell className="font-medium">{ethnicity.name}</TableCell>
                                <TableCell className="text-right">{ethnicity.totalNumber.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </>
    );
};
export default Ethnicities;
