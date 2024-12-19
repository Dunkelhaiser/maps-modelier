import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useGetAllEthnicities } from "@ipc/ethnicities";
import { useSidebarStore } from "@store/sidebar";
import { useAppStore } from "@store/store";
import { Button } from "@ui/Button";
import { CardContent, CardTitle } from "@ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/Table";
import { Edit, Plus, Trash } from "lucide-react";

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
                        <TableRow className="hover:bg-card">
                            <TableCell className="font-medium" />
                            <TableCell className="text-right" />
                            <TableCell className="text-right">
                                <Button size="icon" variant="ghost" className="size-6" aria-label="Add">
                                    <Plus className="!size-3.5" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        {data?.map((ethnicity) => (
                            <TableRow key={ethnicity.id}>
                                <TableCell className="font-medium">{ethnicity.name}</TableCell>
                                <TableCell className="text-right">{ethnicity.totalNumber.toLocaleString()}</TableCell>
                                <TableCell className="space-x-1 text-right">
                                    <Button size="icon" variant="ghost" className="size-6" aria-label="Edit">
                                        <Edit className="!size-3.5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="size-6" aria-label="Delete">
                                        <Trash className="!size-3.5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </>
    );
};
export default Ethnicities;
