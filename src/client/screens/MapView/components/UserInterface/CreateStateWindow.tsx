import { useCreateState } from "@ipc/states";
import { useMapSotre } from "@store/store";
import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Input } from "@ui/Input";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    className?: string;
}

const CreateStateWindow = ({ className }: Props) => {
    const [stateName, setStateName] = useState("");
    const deselectProvinces = useMapSotre((state) => state.deselectProvinces);
    const selectedProvince = useMapSotre((state) => state.selectedProvinces);
    const activeMap = useMapSotre((state) => state.activeMap)!;
    const addState = useCreateState(activeMap.id);

    const createNewState = async () => {
        try {
            const selectedProvincesIds = selectedProvince.map((province) => province.id);
            await addState.mutateAsync({ name: stateName, provinces: selectedProvincesIds });
            setStateName("");
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else toast.error("An error occurred");
        }
    };

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>No State</CardTitle>
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
                <Input placeholder="State Name" value={stateName} onChange={(e) => setStateName(e.target.value)} />
                <Button onClick={createNewState}>Create State</Button>
            </CardContent>
        </Card>
    );
};
export default CreateStateWindow;
