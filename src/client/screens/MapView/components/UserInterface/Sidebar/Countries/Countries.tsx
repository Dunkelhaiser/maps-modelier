import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountries } from "@ipc/countries";
import { useSidebarStore } from "@store/sidebar";
import { CardContent, CardTitle } from "@ui/Card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@ui/Table";
import CountryRow from "./CountryRow";

const Countries = () => {
    const activeMap = useActiveMap();
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);
    const { data } = useGetCountries(activeMap.id);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">Countries</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-card">
                            <TableHead>Flag</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Population</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>{data?.map((country) => <CountryRow country={country} key={country.tag} />)}</TableBody>
                </Table>
            </CardContent>
        </>
    );
};
export default Countries;
