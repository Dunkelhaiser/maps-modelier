import { useActiveMap } from "@hooks/useActiveMap";
import { useGetMembers } from "@ipc/parties";
import { useMapStore } from "@store/store";
import Politician from "../Politicians/Politician";

const PartyMembers = () => {
    const activeMap = useActiveMap();
    const selectedParty = useMapStore((state) => state.selectedParty)!;
    const { data: members = [] } = useGetMembers(activeMap, selectedParty);

    return (
        <div className="space-y-2">
            <p className="text-lg font-semibold">Prominent Party Members</p>
            <div className="grid grid-cols-3 gap-2">
                {members.map((member) => (
                    <Politician key={member.id} politician={member} />
                ))}
            </div>
        </div>
    );
};
export default PartyMembers;
