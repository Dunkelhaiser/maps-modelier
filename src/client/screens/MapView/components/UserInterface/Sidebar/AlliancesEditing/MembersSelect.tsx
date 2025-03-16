import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountries } from "@ipc/countries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";

interface Props {
    onChange: (value: string) => void;
    value: string;
    selectedMembers: string[];
    isLeader: boolean;
}

const MembersSelect = ({ onChange, value, selectedMembers, isLeader }: Props) => {
    const activeMap = useActiveMap();
    const countries = useGetCountries(activeMap.id);

    return (
        <Select onValueChange={onChange} defaultValue={value} disabled={isLeader}>
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Member" />
            </SelectTrigger>
            <SelectContent>
                {countries.data
                    ?.filter((country) => country.tag === value || !selectedMembers.includes(country.tag))
                    .map((country) => (
                        <SelectItem value={country.tag} key={country.tag}>
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
