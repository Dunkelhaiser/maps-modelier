import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Label } from "@ui/Label";
import { X } from "lucide-react";

const ViewWindow = () => {
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const selectedState = useMapStore((state) => state.selectedState);
    const selectedCountry = useMapStore((state) => state.selectedCountry);

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
            <CardContent className="space-y-4">
                {selectedProvinces.length === 1 && (
                    <>
                        <div className="space-y-2">
                            <Label>Owner</Label>
                            {/* temporary placeholder */}
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW_KykquMknj5dTIu5rxG4Y6bCGCNOCA5qSQ&s"
                                alt={`${selectedCountry?.name} flag`}
                                className="aspect-[4/3] h-8 object-cover"
                            />
                        </div>
                        <div>
                            <Label>Province Population</Label>
                            <p>{selectedProvinces[0]?.population.toLocaleString()} people</p>
                        </div>
                        <div>
                            <Label>State Population</Label>
                            <p>{selectedState?.population.toLocaleString()} people</p>
                        </div>
                    </>
                )}
                {selectedProvinces.length > 1 && (
                    <div>
                        <Label>Provinces Population</Label>
                        <p>
                            {selectedProvinces
                                .reduce((sum, province) => sum + (province.population || 0), 0)
                                .toLocaleString()}{" "}
                            people
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
export default ViewWindow;
