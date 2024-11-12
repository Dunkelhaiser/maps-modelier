import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Label } from "@ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { X } from "lucide-react";
import { useMapStore } from "@/store/store";

const ProvinceWindow = () => {
    const selectedProvince = useMapStore((state) => state.selectedProvince);
    const deselectProvince = useMapStore((state) => state.deselectProvince);

    if (!selectedProvince) return null;

    return (
        <Card className="absolute bottom-3 left-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Province</CardTitle>
                <Button variant="ghost" aria-label="Close" size="icon" onClick={deselectProvince} className="size-auto">
                    <X />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label>Province Type</Label>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Type" />
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
