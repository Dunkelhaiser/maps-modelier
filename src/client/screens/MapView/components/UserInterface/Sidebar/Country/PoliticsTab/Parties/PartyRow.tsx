import { useMapStore } from "@store/store";
import { TableCell, TableRow } from "@ui/Table";
import { PoliticalPartyTable } from "src/shared/types";

interface Props {
    party: PoliticalPartyTable;
}

const PartyRow = ({ party }: Props) => {
    const selectParty = useMapStore((state) => state.selectParty).bind(null, party.id);

    return (
        <TableRow className="relative w-[9.25rem]">
            <TableCell>
                <div className="mr-2 size-5 rounded-full" style={{ backgroundColor: party.color }} />
            </TableCell>
            <TableCell className="font-medium">{party.acronym ?? party.name}</TableCell>
            <TableCell>{party.primaryIdeology?.name}</TableCell>
            <TableCell className="text-right">
                {party.membersCount.toLocaleString()}
                <button className="absolute inset-0" type="button" onClick={selectParty} />
            </TableCell>
        </TableRow>
    );
};
export default PartyRow;
