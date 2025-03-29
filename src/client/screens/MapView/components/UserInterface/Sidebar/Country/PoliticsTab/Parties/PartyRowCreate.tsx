import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { TableCell, TableRow } from "@ui/Table";
import { Plus } from "lucide-react";

const PartyRowCreate = () => {
    const selectParty = useMapStore((state) => state.selectParty);

    const createPartyHandler = () => {
        selectParty(-1);
    };

    return (
        <TableRow className="hover:bg-card">
            <TableCell />
            <TableCell className="font-medium" />
            <TableCell />
            <TableCell className="text-right">
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-6"
                    aria-label="Add"
                    type="button"
                    onClick={createPartyHandler}
                >
                    <Plus className="!size-3.5" />
                </Button>
            </TableCell>
        </TableRow>
    );
};
export default PartyRowCreate;
