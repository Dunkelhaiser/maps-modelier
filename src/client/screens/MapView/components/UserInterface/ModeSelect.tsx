import { useAppStore } from "@store/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";

const ModeSelect = () => {
    const mode = useAppStore((state) => state.mode);
    const setMode = useAppStore((state) => state.setMode);

    return (
        <Select onValueChange={setMode} value={mode}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="viewing">Viewing</SelectItem>
                <SelectItem value="provinces_editing">Provinces Editing</SelectItem>
                <SelectItem value="states_editing">States Editing</SelectItem>
                <SelectItem value="countries_editing">Countries Editing</SelectItem>
            </SelectContent>
        </Select>
    );
};
export default ModeSelect;
