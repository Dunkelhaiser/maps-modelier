import { useMapStore } from "@store/store";
import { TableCell, TableRow } from "@ui/Table";
import { WarTable } from "src/shared/types";

interface Props {
    war: WarTable;
}

const WarRow = ({ war }: Props) => {
    const selectWar = useMapStore((state) => state.selectWar).bind(null, war.id);

    return (
        <TableRow className="relative w-[9.25rem]">
            <TableCell className="font-medium">{war.name}</TableCell>
            <TableCell className="text-center">{war.totalParticipants}</TableCell>
            <TableCell>
                <img
                    src={war.aggressor.flag}
                    alt={`${war.aggressor.name} flag`}
                    className="mx-auto aspect-[3/2] h-6 rounded-md object-cover"
                />
            </TableCell>
            <TableCell className="font-medium">
                <img
                    src={war.defender.flag}
                    alt={`${war.defender.name} flag`}
                    className="mx-auto aspect-[3/2] h-6 rounded-md object-cover"
                />
                <button className="absolute inset-0" type="button" onClick={selectWar} />
            </TableCell>
        </TableRow>
    );
};
export default WarRow;
