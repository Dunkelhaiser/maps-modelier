import { useActiveMap } from "@hooks/useActiveMap";
import { useChangeProvinceType } from "@ipc/provinces";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Label } from "@ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { X } from "lucide-react";
import PopulationForm from "../PopulationForm/PopulationForm";

interface Props {
    className?: string;
}

const ProvinceWindow = ({ className }: Props) => {
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);
    const activeMap = useActiveMap();
    const changeProvinceType = useChangeProvinceType(activeMap);

    if (selectedProvinces.length === 0) return null;

    const handleTypeChange = async (type: "land" | "water") => {
        const provinceIds = selectedProvinces.map((province) => province.id);
        changeProvinceType.mutate({ provinceIds, type });
    };

    const sameTypes = selectedProvinces.every((province) => province.type === selectedProvinces[0].type);
    const allLand = selectedProvinces.every((province) => province.type === "land");
    const totalPopulation = selectedProvinces.reduce((sum, province) => sum + (province.population || 0), 0);

    return (
        <Card className={className}>
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
            <CardContent className="space-y-4">
                {allLand && (
                    <p className="text-sm">
                        <span className="font-medium">Overall Population:</span> {totalPopulation.toLocaleString()}{" "}
                        people
                    </p>
                )}
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
                {selectedProvinces.length === 1 && selectedProvinces[0].type === "land" && (
                    <PopulationForm
                        ethnicities={selectedProvinces[0].ethnicities.map((e) => ({
                            ethnicityId: e.id,
                            population: e.population,
                        }))}
                    />
                )}
            </CardContent>
        </Card>
    );
};
export default ProvinceWindow;
