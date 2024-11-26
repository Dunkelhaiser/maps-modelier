import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Input } from "@ui/Input";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMapStore } from "@/store/store";

interface Props {
    className?: string;
}

const StateWindow = ({ className }: Props) => {
    const [stateName, setStateName] = useState("");
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);
    const selectedState = useMapStore((state) => state.selectedState);
    const addState = useMapStore((state) => state.addState);

    const createNewState = async () => {
        try {
            await addState(stateName);
            setStateName("");
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else toast.error("An error occurred");
        }
    };

    if (selectedProvinces.length === 0) return null;

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{selectedState?.name ?? "No State"}</CardTitle>
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
                {!selectedState && (
                    <div className="space-y-2">
                        <Input
                            placeholder="State Name"
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                        />
                        <Button onClick={createNewState}>Create State</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
export default StateWindow;
