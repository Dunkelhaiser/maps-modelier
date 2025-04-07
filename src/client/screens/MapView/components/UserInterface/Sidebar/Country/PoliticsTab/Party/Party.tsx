import CardHeaderWithClose from "@components/CardHeaderWithClose";
import InfoBlock from "@components/InfoBlock";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetParty } from "@ipc/parties";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { formatDate } from "@utils/utils";
import { Users, Calendar } from "lucide-react";
import Politician from "../Politicians/Politician";
import IdeologyTag from "./IdeologyTag";
import PartyMembers from "./PartyMembers";

const Party = () => {
    const activeMap = useActiveMap();
    const selectedParty = useMapStore((state) => state.selectedParty)!;

    const { data: party } = useGetParty(activeMap, selectedParty);

    if (!party) {
        return <p className="p-4 text-center">Loading party data...</p>;
    }

    const date = party.foundedAt ? formatDate(party.foundedAt) : "Unknown";

    return (
        <>
            <CardHeaderWithClose>
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full" style={{ backgroundColor: party.color }} />
                    <CardTitle className="text-xl">{party.acronym ?? party.name}</CardTitle>
                    {party.acronym && <p className="text-sm font-medium text-muted-foreground">({party.name})</p>}
                </div>
            </CardHeaderWithClose>
            <CardContent className="h-[calc(100%_-_1rem_-_calc(45.6px_+_1.75rem))] space-y-4 overflow-y-auto">
                <div className="grid grid-cols-[0.75fr_1fr] items-start gap-4">
                    <div className="flex flex-col gap-2">
                        <Politician politician={party.leader} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <InfoBlock Icon={Users} label="Member Count" value={party.membersCount.toLocaleString()} />
                        <InfoBlock Icon={Calendar} label="Founded" value={date} />

                        <div>
                            <h3 className="mb-2 font-medium">Ideologies</h3>
                            <div className="flex flex-wrap gap-2">
                                <IdeologyTag ideology={party.primaryIdeology} />
                                {party.ideologies.map((ideology) => (
                                    <IdeologyTag key={ideology.id} ideology={ideology} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <PartyMembers />
            </CardContent>
        </>
    );
};

export default Party;
