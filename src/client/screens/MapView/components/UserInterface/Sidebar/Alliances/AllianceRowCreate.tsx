import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { TableCell, TableRow } from "@ui/Table";
import { Plus } from "lucide-react";

const AllianceRowCreate = () => {
    const selectAlliance = useMapStore((state) => state.selectAlliance);

    const createAllianceHandler = () => {
        selectAlliance(-1);
    };

    return (
        <TableRow className="hover:bg-card">
            <TableCell className="text-right" />
            <TableCell className="text-right" />
            <TableCell className="text-right" />
            <TableCell className="text-right">
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-6"
                    aria-label="Add"
                    type="button"
                    onClick={createAllianceHandler}
                >
                    <Plus className="!size-3.5" />
                </Button>
            </TableCell>
        </TableRow>
    );
};
export default AllianceRowCreate;
