import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountriesTable } from "@ipc/countries";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { SortableTableHead, Table, TableBody, TableHead, TableHeader } from "@ui/Table";
import { useState } from "react";
import { GetCountriesInput } from "src/shared/schemas/countries/getCountries";
import CountryRow from "./CountryRow";
import CountryRowCreate from "./CountryRowCreate";

const Countries = () => {
    const activeMap = useActiveMap();
    const mode = useMapStore((state) => state.mode);
    const [sortConfig, setSortConfig] = useState<GetCountriesInput>({
        sortBy: "commonName",
        sortOrder: "asc",
    });
    const { data } = useGetCountriesTable(activeMap, sortConfig);

    return (
        <>
            <CardHeaderWithClose>
                <CardTitle className="text-xl">Countries</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableHead>Flag</TableHead>
                        <SortableTableHead sortKey="commonName" sortConfig={sortConfig} setSortConfig={setSortConfig}>
                            Name
                        </SortableTableHead>
                        <SortableTableHead
                            alignItems="right"
                            sortKey="population"
                            sortConfig={sortConfig}
                            setSortConfig={setSortConfig}
                        >
                            Population
                        </SortableTableHead>
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
