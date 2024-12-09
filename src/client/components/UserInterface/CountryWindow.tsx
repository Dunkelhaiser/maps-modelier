import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Input } from "@ui/Input";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMapStore } from "@/store/store";

interface Props {
    className?: string;
}

const CountryWindow = ({ className }: Props) => {
    const selectedCountry = useMapStore((state) => state.selectedCountry);
    const [countryName, setCountryName] = useState(selectedCountry?.name ?? "");
    const [countryTag, setCountryTag] = useState(selectedCountry?.tag ?? "");
    const [countryColor, setCountryColor] = useState(selectedCountry?.color ?? "");
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);
    const updateCountry = useMapStore((state) => state.updateCountry);

    const createNewState = async () => {
        if (!selectedCountry?.tag) return;
        try {
            await updateCountry(selectedCountry.tag, { name: countryName, color: countryColor, tag: countryTag });
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else toast.error("An error occurred");
        }
    };

    useEffect(() => {
        setCountryName(selectedCountry?.name ?? "");
        setCountryTag(selectedCountry?.tag ?? "");
        setCountryColor(selectedCountry?.color ?? "");
    }, [selectedCountry]);

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>{selectedCountry?.name}</CardTitle>
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
            <CardContent className="space-y-2">
                <Input
                    placeholder="Country Name"
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                />
                <Input placeholder="Country Tag" value={countryTag} onChange={(e) => setCountryTag(e.target.value)} />
                <Input
                    placeholder="Country Color"
                    value={countryColor}
                    onChange={(e) => setCountryColor(e.target.value)}
                />
                <Button onClick={createNewState}>Update Country</Button>
            </CardContent>
        </Card>
    );
};
export default CountryWindow;
