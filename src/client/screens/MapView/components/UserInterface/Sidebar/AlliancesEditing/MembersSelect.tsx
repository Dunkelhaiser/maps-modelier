import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountriesBase } from "@ipc/countries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";

interface Props {
    onChange: (value: string) => void;
    value: number;
    selectedMembers: number[];
    isLeader: boolean;
}

const MembersSelect = ({ onChange, value, selectedMembers, isLeader }: Props) => {
    const activeMap = useActiveMap();
    const countries = useGetCountriesBase(activeMap);

    return (
        <Select onValueChange={onChange} defaultValue={String(value)} disabled={isLeader}>
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Member" />
            </SelectTrigger>
            <SelectContent>
                {countries.data
                    ?.filter((country) => country.id === value || !selectedMembers.includes(country.id))
                    .map((country) => (
                        <SelectItem value={String(country.id)} key={country.id}>
                            <div className="flex flex-row items-center gap-2">
                                <img
                                    src={country.flag}
                                    alt={`${country.name} flag`}
                                    className="aspect-[3/2] h-4 rounded-sm object-cover"
                                />
                                {country.name}
                            </div>
                        </SelectItem>
                    ))}
            </SelectContent>
        </Select>
    );
};

export default MembersSelect;
