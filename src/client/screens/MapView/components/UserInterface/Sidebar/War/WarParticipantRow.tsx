import { useMapStore } from "@store/store";
import { TableCell, TableRow } from "@ui/Table";
import { CountryBase } from "src/shared/types";

interface Props {
    participant: CountryBase;
}

const WarParticipantRow = ({ participant }: Props) => {
    const selectCountry = useMapStore((state) => state.selectCountry);

    return (
        <TableRow className="relative">
            <TableCell>
                <img
                    src={participant.flag}
                    alt={`Flag of ${participant.name}`}
                    className="aspect-[3/2] h-6 rounded-md border border-border object-cover"
                />
                <button className="absolute inset-0" type="button" onClick={() => selectCountry(participant.id)} />
            </TableCell>
            <TableCell>{participant.name}</TableCell>
        </TableRow>
    );
};

export default WarParticipantRow;
