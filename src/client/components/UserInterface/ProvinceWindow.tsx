import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Label } from "@ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { X } from "lucide-react";
import { useMapStore } from "@/store/store";

const ProvinceWindow = () => {
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);
    const syncProvinceType = useMapStore((state) => state.syncProvinceType);
    const activeMap = useMapStore((state) => state.activeMap)!;

    if (selectedProvinces.length === 0) return null;

    const handleTypeChange = async (type: "land" | "water") => {
        const provinceIds = selectedProvinces.map((province) => province.id);
        await window.electronAPI.changeProvinceType(activeMap.id, provinceIds, type);
        syncProvinceType(provinceIds, type);
    };

    const sameTypes = selectedProvinces.every((province) => province.type === selectedProvinces[0].type);

    return (
        <Card className="absolute bottom-3 left-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    {selectedProvinces.length === 1 ? "Province" : `${selectedProvinces.length} Provinces`}
                </CardTitle>
                <Button
                    variant="ghost"
                    aria-label="Close"
                    size="icon"
                    onClick={deselectProvinces}
                    className="size-auto"
                >
                    <X />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label>Province Type</Label>
                    <Select value={sameTypes ? selectedProvinces[0].type : undefined} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={sameTypes ? "Type" : "Mixed Types"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="land">Land</SelectItem>
                            <SelectItem value="water">Water</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
};
export default ProvinceWindow;
