import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { useMapStore } from "@/store/store";

const ModeSelect = () => {
    const mode = useMapStore((state) => state.mode);
    const setMode = useMapStore((state) => state.setMode);

    return (
        <Select onValueChange={setMode} value={mode}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="viewing">Viewing</SelectItem>
                <SelectItem value="provinces_editing">Provinces Editing</SelectItem>
                <SelectItem value="states_editing">States Editing</SelectItem>
            </SelectContent>
        </Select>
    );
};
export default ModeSelect;
