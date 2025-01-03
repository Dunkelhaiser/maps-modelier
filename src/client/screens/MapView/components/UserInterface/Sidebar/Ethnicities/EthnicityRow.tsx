import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { TableCell, TableRow } from "@ui/Table";
import { Ethnicity } from "@utils/types";
import { Edit } from "lucide-react";
import { useState } from "react";
import DeleteEthnicityDialog from "./DeleteEthnicityDialog";
import EthnicityRowEdit from "./EthnicityRowEdit";

interface Props {
    mapId: string;
    ethnicity: Ethnicity;
}

const EthnicityRow = ({ mapId, ethnicity }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const mode = useMapStore((state) => state.mode);

    return !isEditing ? (
        <TableRow className="w-[9.25rem]">
            <TableCell className="font-medium">{ethnicity.name}</TableCell>
            <TableCell className="text-right">{ethnicity.totalNumber?.toLocaleString() ?? 0}</TableCell>
            {mode !== "viewing" && (
                <TableCell className="space-x-1 text-right">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-6"
                        aria-label="Edit"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit className="!size-3.5" />
                    </Button>
                    <DeleteEthnicityDialog mapId={mapId} id={ethnicity.id} />
                </TableCell>
            )}
        </TableRow>
    ) : (
        <EthnicityRowEdit ethnicity={ethnicity} mapId={mapId} stopEditing={() => setIsEditing(false)} />
    );
};
export default EthnicityRow;
