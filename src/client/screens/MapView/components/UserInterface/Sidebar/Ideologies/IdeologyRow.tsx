import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { TableCell, TableRow } from "@ui/Table";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Ideology } from "src/shared/types";
import DeleteIdeologyDialog from "./DeleteIdeologyDialog";
import IdeologyRowEdit from "./IdeologyRowEdit";

interface Props {
    mapId: string;
    ideology: Ideology;
}

const IdeologyRow = ({ mapId, ideology }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const mode = useMapStore((state) => state.mode);

    return !isEditing ? (
        <TableRow className="w-[9.25rem]">
            <TableCell className="font-medium">
                <div className="mr-2 size-5 rounded-full" style={{ backgroundColor: ideology.color }} />
            </TableCell>
            <TableCell className="font-medium">{ideology.name}</TableCell>
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
                    <DeleteIdeologyDialog mapId={mapId} id={ideology.id} />
                </TableCell>
            )}
        </TableRow>
    ) : (
        <IdeologyRowEdit ideology={ideology} mapId={mapId} stopEditing={() => setIsEditing(false)} />
    );
};
export default IdeologyRow;
