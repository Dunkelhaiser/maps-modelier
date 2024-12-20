import { Button } from "@ui/Button";
import { TableCell, TableRow } from "@ui/Table";
import { Ethnicity } from "@utils/types";
import { Edit } from "lucide-react";
import DeleteEthnicityDialog from "./DeleteEthnicityDialog";

interface Props {
    mapId: string;
    ethnicity: Ethnicity;
}

const EthnicityRow = ({ mapId, ethnicity }: Props) => {
    return (
        <TableRow>
            <TableCell className="font-medium">{ethnicity.name}</TableCell>
            <TableCell className="text-right">{ethnicity.totalNumber.toLocaleString()}</TableCell>
            <TableCell className="space-x-1 text-right">
                <Button size="icon" variant="ghost" className="size-6" aria-label="Edit">
                    <Edit className="!size-3.5" />
                </Button>
                <DeleteEthnicityDialog mapId={mapId} id={ethnicity.id} />
            </TableCell>
        </TableRow>
    );
};
export default EthnicityRow;
