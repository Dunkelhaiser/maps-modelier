import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { X } from "lucide-react";
import AssignStateForm from "./AssignStateForm";
import RenameStateForm from "./RenameStateForm";

interface Props {
    className?: string;
}

const StateWindow = ({ className }: Props) => {
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);
    const selectedState = useMapStore((state) => state.selectedState);

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
            <CardContent className="space-y-2">
                {selectedState?.type === "land" && <AssignStateForm />}
                <RenameStateForm />
            </CardContent>
        </Card>
    );
};
export default StateWindow;
