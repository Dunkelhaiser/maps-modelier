import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Label } from "@ui/Label";
import { EthnicityComposition } from "@utils/types";
import { X } from "lucide-react";
import EthnicComposition from "./EthnicComposition";

const ViewWindow = () => {
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const selectedState = useMapStore((state) => state.selectedState);
    const selectedCountry = useMapStore((state) => state.selectedCountry);
    const selectCountry = useMapStore((state) => state.selectCountry).bind(null, selectedCountry);

    const areAllLandProvinces = selectedProvinces.every((province) => province.type === "land");

    const calculateMergedEthnicities = () => {
        const merged = new Map<number, EthnicityComposition>();

        selectedProvinces.forEach((province) => {
            province.ethnicities.forEach((ethnicity) => {
                const current = merged.get(ethnicity.id) ?? {
                    id: ethnicity.id,
                    name: ethnicity.name,
                    population: 0,
                };
                current.population += ethnicity.population;
                merged.set(ethnicity.id, current);
            });
        });

        return Array.from(merged.values());
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-12">
                <CardTitle>
                    {selectedProvinces.length > 1 ? `${selectedProvinces.length} Provinces` : selectedState?.name}
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
            {areAllLandProvinces && (
                <CardContent className="space-y-4">
                    {selectedProvinces.length === 1 && (
                        <>
                            {selectedCountry && (
                                <div className="flex flex-col items-start gap-2">
                                    <Label>Owner</Label>
                                    <button type="button" onClick={selectCountry}>
                                        <img
                                            src={selectedCountry.flag}
                                            alt={`${selectedCountry.name} flag`}
                                            className="aspect-[3/2] h-8 rounded-md object-cover"
                                        />
                                    </button>
                                </div>
                            )}
                            <div>
                                <Label>Province Population</Label>
                                <EthnicComposition
                                    totalPopulation={selectedProvinces[0].population}
                                    ethnicities={selectedProvinces[0].ethnicities}
                                />
                            </div>
                            <div>
                                <Label>State Population</Label>
                                <EthnicComposition
                                    totalPopulation={selectedState!.population}
                                    ethnicities={selectedState!.ethnicities}
                                />
                            </div>
                        </>
                    )}
                    {selectedProvinces.length > 1 && (
                        <div>
                            <Label>Provinces Population</Label>
                            <EthnicComposition
                                totalPopulation={selectedProvinces.reduce(
                                    (sum, province) => sum + (province.population || 0),
                                    0
                                )}
                                ethnicities={calculateMergedEthnicities()}
                            />
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
};
export default ViewWindow;
