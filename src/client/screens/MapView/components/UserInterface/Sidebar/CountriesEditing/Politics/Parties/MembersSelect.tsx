import { useActiveMap } from "@hooks/useActiveMap";
import { useGetPoliticians } from "@ipc/politicians";
import { useMapStore } from "@store/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";

interface Props {
    onChange: (value: string) => void;
    value: number;
    selectedMembers: number[];
    isLeader: boolean;
}

const MembersSelect = ({ onChange, value, selectedMembers, isLeader }: Props) => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const politicians = useGetPoliticians(activeMap, selectedCountry);

    return (
        <Select onValueChange={onChange} defaultValue={String(value)} disabled={isLeader}>
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Member" />
            </SelectTrigger>
            <SelectContent>
                {politicians.data
                    ?.filter((politician) => politician.id === value || !selectedMembers.includes(politician.id))
                    .map((politician) => (
                        <SelectItem value={String(politician.id)} key={politician.id}>
                            {politician.name}
                        </SelectItem>
                    ))}
            </SelectContent>
        </Select>
    );
};

export default MembersSelect;
