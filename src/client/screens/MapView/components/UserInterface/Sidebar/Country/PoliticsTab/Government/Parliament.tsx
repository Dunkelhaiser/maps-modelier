import InfoBlock from "@components/InfoBlock";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetParties } from "@ipc/government";
import { Users } from "lucide-react";
import { Parliament as ParliamentType } from "src/shared/types";
import Politician from "../Politicians/Politician";
import ParliamentVisualization from "./ParliamentVisualization";
import Parties from "./Parties";

interface Props {
    parliament: ParliamentType;
}

const Parliament = ({ parliament }: Props) => {
    const activeMap = useActiveMap();
    const { data: parliamentParties } = useGetParties(activeMap, parliament.id);

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">{parliament.name}</h3>
            <InfoBlock
                Icon={Users}
                label="Seats"
                value={(parliament.coalition.seats + parliament.opposition.seats + parliament.neutral.seats).toString()}
                suffix={`/ ${parliament.seatsNumber.toString()}`}
            />

            {parliamentParties && parliamentParties.length > 0 && (
                <ParliamentVisualization groups={parliamentParties} seatsNumber={parliament.seatsNumber} />
            )}

            <div className="grid grid-cols-2 gap-4">
                {parliament.coalitionLeader && (
                    <div className="flex flex-col gap-2">
                        <h4 className="font-medium">Coalition Leader</h4>
                        <Politician politician={parliament.coalitionLeader} />
                    </div>
                )}
                {parliament.oppositionLeader && (
                    <div className="flex flex-col gap-2">
                        <h4 className="font-medium">Opposition Leader</h4>
                        <Politician politician={parliament.oppositionLeader} />
                    </div>
                )}
            </div>
            {parliamentParties && parliamentParties.length > 0 && <Parties groups={parliamentParties} />}
        </div>
    );
};

export default Parliament;
