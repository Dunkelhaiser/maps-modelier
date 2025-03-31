import { useMapStore } from "@store/store";
import { ParliamentGroup } from "src/shared/types";

interface Props {
    groups: ParliamentGroup[];
}

const Parties = ({ groups }: Props) => {
    const getGroupTitle = (side: string) => {
        switch (side) {
            case "ruling_coalition":
                return "Ruling Coalition";
            case "neutral":
                return "Neutral";
            case "opposition":
                return "Opposition";
            default:
                return side;
        }
    };

    const selectParty = useMapStore((state) => state.selectParty);

    return groups.map((group) => (
        <div key={group.side} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{getGroupTitle(group.side)}</h4>{" "}
                <span className="text-xs text-muted-foreground">{group.parties.length} parties</span>
                <span className="text-xs text-muted-foreground">
                    • {group.parties.reduce((acc, party) => acc + party.seats, 0)} seats
                </span>
            </div>
            <div className="grid gap-2">
                {group.parties.map((party) => (
                    <button
                        key={party.id}
                        className="flex items-center justify-between rounded-md border p-2"
                        type="button"
                        onClick={() => selectParty(party.id)}
                    >
                        <div className="flex items-center gap-2">
                            <div className="size-4 rounded-full" style={{ backgroundColor: party.color }} />
                            <span className="text-sm">{party.acronym ?? party.name}</span>
                        </div>
                        <span className="text-sm font-medium">{party.seats} seats</span>
                    </button>
                ))}
            </div>
        </div>
    ));
};

export default Parties;
