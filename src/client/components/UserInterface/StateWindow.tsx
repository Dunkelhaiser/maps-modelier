import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { X } from "lucide-react";
import { useMapStore } from "@/store/store";

interface Props {
    className?: string;
}

const StateWindow = ({ className }: Props) => {
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);
    const selectedState = useMapStore((state) => state.selectedState);

    if (selectedProvinces.length === 0) return null;

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{selectedState?.name}</CardTitle>
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
            <CardContent>{selectedState?.name}</CardContent>
        </Card>
    );
};
export default StateWindow;
