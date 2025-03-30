import { useActiveMap } from "@hooks/useActiveMap";
import { useGetParties } from "@ipc/parties";
import { useMapStore } from "@store/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";

interface Props {
    onChange: (value: string) => void;
    value: number;
    selectedParties: number[];
}

const PartiesSelect = ({ onChange, value, selectedParties }: Props) => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const parties = useGetParties(activeMap, selectedCountry);

    return (
        <Select onValueChange={onChange} defaultValue={String(value)}>
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Party" />
            </SelectTrigger>
            <SelectContent>
                {parties.data
                    ?.filter((party) => party.id === value || !selectedParties.includes(party.id))
                    .map((party) => (
                        <SelectItem value={String(party.id)} key={party.id}>
                            <div className="flex flex-row items-center gap-2">
                                <div
                                    className="size-3 rounded-full"
                                    style={{
                                        backgroundColor: party.color,
                                    }}
                                />
                                {party.acronym ?? party.name}
                            </div>
                        </SelectItem>
                    ))}
            </SelectContent>
        </Select>
    );
};

export default PartiesSelect;
