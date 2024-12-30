import { useMapSotre } from "@store/store";
import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { X } from "lucide-react";
import CreateStateForm from "./CreateStateForm";

interface Props {
    className?: string;
}

const CreateStateWindow = ({ className }: Props) => {
    const deselectProvinces = useMapSotre((state) => state.deselectProvinces);

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
            <CardContent>
                <CreateStateForm />
            </CardContent>
        </Card>
    );
};
export default CreateStateWindow;
