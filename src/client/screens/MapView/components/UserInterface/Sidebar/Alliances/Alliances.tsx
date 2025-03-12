import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@ui/Table";
import AllianceRowCreate from "./AllianceRowCreate";

const Alliances = () => {
    const mode = useMapStore((state) => state.mode);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">Alliances</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-card">
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Members</TableHead>
                            <TableHead className="text-right">Leader</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>{mode === "editing" && <AllianceRowCreate />}</TableBody>
                </Table>
            </CardContent>
        </>
    );
};
export default Alliances;
