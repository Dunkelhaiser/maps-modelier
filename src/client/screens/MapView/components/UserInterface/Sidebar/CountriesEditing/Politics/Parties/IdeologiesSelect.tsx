import { useActiveMap } from "@hooks/useActiveMap";
import { useGetAllIdeologies } from "@ipc/ideologies";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";

interface Props {
    onChange: (value: string) => void;
    value: number;
    selectedIdeologies: number[];
}

const IdeologiesSelect = ({ onChange, value, selectedIdeologies }: Props) => {
    const activeMap = useActiveMap();
    const ideologies = useGetAllIdeologies(activeMap);

    return (
        <Select onValueChange={onChange} defaultValue={String(value)}>
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Ideology" />
            </SelectTrigger>
            <SelectContent>
                {ideologies.data
                    ?.filter((ideology) => ideology.id === value || !selectedIdeologies.includes(ideology.id))
                    .map((ideology) => (
                        <SelectItem value={String(ideology.id)} key={ideology.id}>
                            <div className="flex flex-row items-center gap-2">
                                <div
                                    className="size-3 rounded-full"
                                    style={{
                                        backgroundColor: ideology.color,
                                    }}
                                />
                                {ideology.name}
                            </div>
                        </SelectItem>
                    ))}
            </SelectContent>
        </Select>
    );
};
export default IdeologiesSelect;
