import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountryById } from "@ipc/countries";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@ui/Table";
import { Users } from "lucide-react";
import { AllianceTag } from "./AllianceTag";
import { EthnicityBar } from "./EthnicityBar";

const Country = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    const { data: country } = useGetCountryById(activeMap, selectedCountry);

    if (!country) {
        return <p className="p-4 text-center">Loading country data...</p>;
    }

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full" style={{ backgroundColor: country.color }} />
                    <CardTitle className="text-xl">{country.name.common}</CardTitle>
                    {country.name.official && (
                        <p className="text-sm font-medium text-muted-foreground">({country.name.official})</p>
                    )}
                </div>
            </CardHeaderWithClose>

            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-4 overflow-auto pb-6">
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <p className="mb-1 text-xs font-medium text-muted-foreground">Flag</p>
                            <div className="overflow-hidden rounded-md border border-border">
                                <img
                                    src={country.flag}
                                    alt={`Flag of ${country.name.common}`}
                                    className="h-32 w-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <p className="mb-1 text-xs font-medium text-muted-foreground">Coat of Arms</p>
                            <div className="aspect-square h-32 overflow-hidden rounded-md border border-border bg-muted/50">
                                {country.coatOfArms && (
                                    <img
                                        src={country.coatOfArms}
                                        alt={`Coat of Arms of ${country.name.common}`}
                                        className="size-full object-contain"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {country.anthem && (
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                National Anthem: {country.anthem.name}
                            </p>
                            <audio controls className="mt-1 w-full" key={`anthem-${selectedCountry}`}>
                                <source src={country.anthem.url} />
                            </audio>
                        </div>
                    )}
                </div>

                <div className="mt-2">
                    <h3 className="mb-2 text-lg font-semibold">Demographics</h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 rounded-md bg-muted p-3 shadow-sm">
                            <div className="rounded-full bg-muted-foreground/10 p-2">
                                <Users size={16} className="text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Population</p>
                                <p className="font-medium">{country.population.toLocaleString()}</p>
                            </div>
                        </div>
                        <EthnicityBar ethnicities={country.ethnicities} />
                    </div>

                    <Table className="mt-3 max-h-40">
                        <TableHeader>
                            <TableHead>Ethnicity</TableHead>
                            <TableHead className="text-right">Population</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                        </TableHeader>
                        <TableBody>
                            {country.ethnicities.map((ethnicity) => (
                                // ! This is a workaround before the ethnicities ids being country id issue is resolved
                                <TableRow key={ethnicity.name}>
                                    <TableCell className="flex items-center gap-2">
                                        <div
                                            className="size-3 rounded-full"
                                            style={{ backgroundColor: ethnicity.color }}
                                        />
                                        {ethnicity.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {ethnicity.population.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {((ethnicity.population / country.population) * 100).toFixed(2)}%
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {country.alliances.length > 0 && (
                    <div className="mt-2">
                        <h3 className="mb-2 text-lg font-semibold">Alliances</h3>
                        <div className="flex flex-wrap gap-2">
                            {country.alliances.map((alliance) => (
                                <AllianceTag key={alliance.id} alliance={alliance} />
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </>
    );
};

export default Country;
