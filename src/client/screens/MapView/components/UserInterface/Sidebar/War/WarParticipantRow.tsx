import { useMapStore } from "@store/store";
import { TableCell, TableRow } from "@ui/Table";
import { Crown, MinusCircle } from "lucide-react";
import { CountryBase } from "src/shared/types";

interface Props {
    participant: CountryBase & { allianceId?: number | null };
    isAllianceLeader?: boolean;
    showAllianceRole?: boolean;
    isParticipating?: boolean;
}

const WarParticipantRow = ({
    participant,
    isAllianceLeader = false,
    showAllianceRole = false,
    isParticipating = true,
}: Props) => {
    const selectCountry = useMapStore((state) => state.selectCountry);

    return (
        <TableRow className={`relative ${!isParticipating ? "opacity-50" : ""}`}>
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
                        <div className="flex items-center justify-end gap-1 text-amber-500">
                            <Crown className="size-3.5" />
                            <span className="text-xs font-medium">Leader</span>
                        </div>
                    )}
                    {!isParticipating && (
                        <div className="flex items-center justify-end gap-1 text-muted-foreground">
                            <MinusCircle className="size-3.5" />
                            <span className="text-xs font-medium">Non-participating</span>
                        </div>
                    )}
                </TableCell>
            )}
        </TableRow>
    );
};

export default WarParticipantRow;
