import { useMapStore } from "@store/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";

const DisplayModeSelect = () => {
    const displayMode = useMapStore((state) => state.displayMode);
    const setDisplayMode = useMapStore((state) => state.setDisplayMode);

    return (
        <Select onValueChange={setDisplayMode} value={displayMode}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="countries">Countries</SelectItem>
                <SelectItem value="ethnicities">Ethnicities</SelectItem>
                <SelectItem value="population">Population</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default DisplayModeSelect;
