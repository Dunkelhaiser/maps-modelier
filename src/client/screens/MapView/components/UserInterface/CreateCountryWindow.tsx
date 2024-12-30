import { useCreateCountry } from "@ipc/countries";
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

const CreateCountryWindow = ({ className }: Props) => {
    const [countryName, setCountryName] = useState("");
    const [countryTag, setCountryTag] = useState("");
    const [countryColor, setCountryColor] = useState("");
    const deselectProvinces = useAppStore((state) => state.deselectProvinces);
    const activeMap = useAppStore((state) => state.activeMap)!;
    const createCountry = useCreateCountry(activeMap.id);

    const createNewState = async () => {
        try {
            createCountry.mutate({ name: countryName, tag: countryTag, color: countryColor });
            setCountryName("");
            setCountryTag("");
            setCountryColor("");
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else toast.error("An error occurred");
        }
    };

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Country Creation</CardTitle>
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
                <Button onClick={createNewState}>Create Country</Button>
            </CardContent>
        </Card>
    );
};
export default CreateCountryWindow;
