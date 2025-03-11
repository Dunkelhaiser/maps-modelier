import { useActiveMap } from "@hooks/useActiveMap";
import { useGetAllEthnicities } from "@ipc/ethnicities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";

interface Props {
    onChange: (value: string) => void;
    value: number;
    selectedEthnicities: number[];
}

const EthnicitiesSelect = ({ onChange, value, selectedEthnicities }: Props) => {
    const activeMap = useActiveMap();
    const ethnicities = useGetAllEthnicities(activeMap.id);

    return (
        <Select onValueChange={onChange} defaultValue={String(value)}>
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Ethnicity" />
            </SelectTrigger>
            <SelectContent>
                {ethnicities.data
                    ?.filter((ethnicity) => ethnicity.id === value || !selectedEthnicities.includes(ethnicity.id))
                    .map((ethnicity) => (
                        <SelectItem value={String(ethnicity.id)} key={ethnicity.id}>
                            {ethnicity.name}
                        </SelectItem>
                    ))}
            </SelectContent>
        </Select>
    );
};

export default EthnicitiesSelect;
