import { useAddStates, useGetCountries } from "@ipc/countries";
import { useDeleteState, useRenameState } from "@ipc/states";
import { useAppStore } from "@store/store";
import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    className?: string;
}

const StateWindow = ({ className }: Props) => {
    const deselectProvinces = useAppStore((state) => state.deselectProvinces);
    const selectedState = useAppStore((state) => state.selectedState);
    const [stateName, setStateName] = useState(selectedState?.name ?? "");
    const activeMap = useAppStore((state) => state.activeMap)!;
    const renameState = useRenameState(activeMap.id, selectedState!.id);
    const deleteState = useDeleteState(activeMap.id, selectedState!.id);
    const { data: countries } = useGetCountries(activeMap.id);
    const addStates = useAddStates(activeMap.id);

    const stateCountry = countries?.find((country) => country.states.includes(selectedState?.id ?? -1));

    const renameStateHandler = () => renameState.mutate(stateName);

    const addStateHandler = (tag: string) => {
        if (selectedState) {
            addStates.mutateAsync({ countryTag: tag, stateIds: [selectedState.id] });
        }
    };

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
                <Input placeholder="State Name" value={stateName} onChange={(e) => setStateName(e.target.value)} />
                <div className="flex flex-row justify-between gap-4">
                    <Button onClick={renameStateHandler}>Rename State</Button>
                    <Button variant="destructive" aria-label="Delete State" onClick={() => deleteState.mutate()}>
                        <Trash />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
export default StateWindow;
