import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Input } from "@ui/Input";
import { Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMapStore } from "@/store/store";

interface Props {
    className?: string;
}

const StateWindow = ({ className }: Props) => {
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);
    const selectedState = useMapStore((state) => state.selectedState);
    const [stateName, setStateName] = useState(selectedState?.name ?? "");
    const renameState = useMapStore((state) => state.renameState);
    const deleteState = useMapStore((state) => state.deleteState);

    const renameStateHandler = () => renameState(stateName);

    useEffect(() => {
        setStateName(selectedState?.name ?? "");
    }, [selectedState]);

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
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
            <CardContent>
                <div className="space-y-2">
                    <Input placeholder="State Name" value={stateName} onChange={(e) => setStateName(e.target.value)} />
                    <Button onClick={renameStateHandler}>Rename State</Button>
                </div>

                <Button variant="destructive" className="mt-4" aria-label="Delete State" onClick={deleteState}>
                    <Trash />
                </Button>
            </CardContent>
        </Card>
    );
};
export default StateWindow;
