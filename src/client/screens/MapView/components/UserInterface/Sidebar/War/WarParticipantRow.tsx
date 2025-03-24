import { useMapStore } from "@store/store";
import { TableCell, TableRow } from "@ui/Table";
import { Crown } from "lucide-react";
import { CountryBase } from "src/shared/types";

interface Props {
    participant: CountryBase & { allianceId?: number | null };
    isAllianceLeader?: boolean;
    showAllianceRole?: boolean;
}

const WarParticipantRow = ({ participant, isAllianceLeader = false, showAllianceRole = false }: Props) => {
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
            {showAllianceRole && (
                <TableCell>
                    {isAllianceLeader && (
                        <div className="flex items-center gap-1 text-amber-500">
                            <Crown className="size-3.5" />
                            <span className="text-xs font-medium">Leader</span>
                        </div>
                    )}
                </TableCell>
            )}
        </TableRow>
    );
};

export default WarParticipantRow;
