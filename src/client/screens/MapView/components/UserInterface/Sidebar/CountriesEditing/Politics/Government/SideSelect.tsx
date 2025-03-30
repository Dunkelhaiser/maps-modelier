import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";

interface Props {
    onChange: (value: string) => void;
    value: string;
}

const SideSelect = ({ onChange, value }: Props) => {
    return (
        <Select onValueChange={onChange} defaultValue={value}>
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Party" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ruling_coalition">Ruling Coalition</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="opposition">Opposition</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default SideSelect;
