import { useAppStore } from "@store/store";
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
    const deselectProvinces = useAppStore((state) => state.deselectProvinces);
    const addState = useAppStore((state) => state.addState);

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
