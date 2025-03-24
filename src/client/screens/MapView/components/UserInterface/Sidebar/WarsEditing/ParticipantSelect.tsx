import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountriesBase } from "@ipc/countries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";

interface Props {
    onChange: (value: string) => void;
    value: number;
    selectedParticipants: number[];
    isPrimary?: boolean;
}

const ParticipantSelect = ({ onChange, value, selectedParticipants, isPrimary = false }: Props) => {
    const activeMap = useActiveMap();
    const { data: countries } = useGetCountriesBase(activeMap);

    return (
        <Select onValueChange={onChange} defaultValue={String(value)} disabled={isPrimary}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
                {countries
                    ?.filter((country) => country.id === value || !selectedParticipants.includes(country.id))
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

export default ParticipantSelect;
