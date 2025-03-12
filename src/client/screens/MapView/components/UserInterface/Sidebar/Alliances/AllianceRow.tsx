import { useMapStore } from "@store/store";
import { TableCell, TableRow } from "@ui/Table";
import { Alliance } from "src/shared/types";

interface Props {
    alliance: Alliance;
}

const AllianceRow = ({ alliance }: Props) => {
    const selectAlliance = useMapStore((state) => state.selectAlliance).bind(null, alliance);

    return (
        <TableRow className="relative w-[9.25rem]">
            <TableCell className="font-medium">{alliance.name}</TableCell>
            <TableCell>{alliance.type}</TableCell>
            <TableCell>{alliance.membersCount.toLocaleString()}</TableCell>
            <TableCell className="font-medium">
                <img
                    src={alliance.leader.flag}
                    alt={`${alliance.leader.name} flag`}
                    className="ml-auto aspect-[3/2] h-6 rounded-md object-cover"
                />
                <button className="absolute inset-0" type="button" onClick={selectAlliance} />
            </TableCell>
        </TableRow>
    );
};
export default AllianceRow;
