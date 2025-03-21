import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountriesTable } from "@ipc/countries";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { Table, TableBody, TableHead, TableHeader } from "@ui/Table";
import CountryRow from "./CountryRow";
import CountryRowCreate from "./CountryRowCreate";

const Countries = () => {
    const activeMap = useActiveMap();
    const mode = useMapStore((state) => state.mode);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);
    const { data } = useGetCountriesTable(activeMap);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">Countries</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableHead>Flag</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Population</TableHead>
                    </TableHeader>
                    <TableBody>
                        {mode === "editing" && <CountryRowCreate />}
                        {data?.map((country) => <CountryRow country={country} key={country.id} />)}
                    </TableBody>
                </Table>
            </CardContent>
        </>
    );
};
export default Countries;
