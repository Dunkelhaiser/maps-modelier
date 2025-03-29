import { useActiveMap } from "@hooks/useActiveMap";
import { useGetParties } from "@ipc/parties";
import { useMapStore } from "@store/store";
import { Table, TableBody, TableHead, TableHeader } from "@ui/Table";
import { TabsContent } from "@ui/Tabs";
import PartyRow from "./PartyRow";
import PartyRowCreate from "./PartyRowCreate";

const PartiesTab = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const mode = useMapStore((state) => state.mode);
    const { data: parties = [] } = useGetParties(activeMap, selectedCountry);

    return (
        <TabsContent value="parties">
            <Table>
                <TableHeader>
                    <TableHead className="w-0" />
                    <TableHead>Name</TableHead>
                    <TableHead>Ideology</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                </TableHeader>
                <TableBody>
                    {mode === "editing" && <PartyRowCreate />}
                    {parties.map((party) => (
                        <PartyRow party={party} key={party.id} />
                    ))}
                </TableBody>
            </Table>
        </TabsContent>
    );
};
export default PartiesTab;
