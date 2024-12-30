import { useGetAllEthnicities } from "@ipc/ethnicities";
import { useMapStore } from "@store/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";

interface Props {
    onChange: (value: string) => void;
    value: number;
}

const EthnicitiesSelect = ({ onChange, value }: Props) => {
    const activeMap = useMapStore((state) => state.activeMap)!;
    const ethnicities = useGetAllEthnicities(activeMap.id);

    return (
        <Select onValueChange={onChange} defaultValue={String(value)}>
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Ethnicity" />
            </SelectTrigger>
            <SelectContent>
                {ethnicities.data?.map((ethnicity) => (
                    <SelectItem value={String(ethnicity.id)} key={ethnicity.id}>
                        {ethnicity.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default EthnicitiesSelect;
