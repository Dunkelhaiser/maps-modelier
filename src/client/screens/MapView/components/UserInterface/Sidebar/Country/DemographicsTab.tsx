import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@ui/Table";
import { TabsContent } from "@ui/Tabs";
import { Users } from "lucide-react";
import { Country } from "src/shared/types";
import { EthnicityBar } from "./EthnicityBar";

interface Props {
    country: Country;
}

const DemographicsTab = ({ country }: Props) => {
    return (
        <TabsContent value="demographics">
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

            {country.ethnicities.length > 0 && (
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
                                    <div className="size-3 rounded-full" style={{ backgroundColor: ethnicity.color }} />
                                    {ethnicity.name}
                                </TableCell>
                                <TableCell className="text-right">{ethnicity.population.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    {((ethnicity.population / country.population) * 100).toFixed(2)}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </TabsContent>
    );
};
export default DemographicsTab;
