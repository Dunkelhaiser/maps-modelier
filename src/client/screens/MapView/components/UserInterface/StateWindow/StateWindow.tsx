import { useAddStates, useGetCountries } from "@ipc/countries";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { X } from "lucide-react";
import RenameStateForm from "./renameStateForm";

interface Props {
    className?: string;
}

const StateWindow = ({ className }: Props) => {
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);
    const selectedState = useMapStore((state) => state.selectedState);
    const activeMap = useMapStore((state) => state.activeMap)!;
    const { data: countries } = useGetCountries(activeMap.id);
    const addStates = useAddStates(activeMap.id);

    const stateCountry = countries?.find((country) => country.states.includes(selectedState?.id ?? -1));

    const addStateHandler = (tag: string) => {
        if (selectedState) {
            addStates.mutateAsync({ countryTag: tag, stateIds: [selectedState.id] });
        }
    };

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
                {selectedState?.type === "land" && (
                    <Select onValueChange={addStateHandler} value={stateCountry?.tag}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="State Owner" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries?.map((country) => (
                                <SelectItem key={country.tag} value={country.tag}>
                                    {country.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <RenameStateForm />
            </CardContent>
        </Card>
    );
};
export default StateWindow;
