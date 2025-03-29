import { useMapStore } from "@store/store";
import { Table, TableBody, TableHead, TableHeader } from "@ui/Table";
import { TabsContent } from "@ui/Tabs";
import { PoliticalPartyTable } from "src/shared/types";
import PartyRow from "./PartyRow";
import PartyRowCreate from "./PartyRowCreate";

interface Props {
    parties: PoliticalPartyTable[];
}

const PartiesTab = ({ parties }: Props) => {
    const mode = useMapStore((state) => state.mode);

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
