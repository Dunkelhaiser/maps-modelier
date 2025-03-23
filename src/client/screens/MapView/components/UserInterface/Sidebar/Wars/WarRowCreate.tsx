import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { TableCell, TableRow } from "@ui/Table";
import { Plus } from "lucide-react";

const WarRowCreate = () => {
    const selectWar = useMapStore((state) => state.selectWar);

    const selectWarHandler = () => {
        selectWar(-1);
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
                    onClick={selectWarHandler}
                >
                    <Plus className="!size-3.5" />
                </Button>
            </TableCell>
        </TableRow>
    );
};
export default WarRowCreate;
