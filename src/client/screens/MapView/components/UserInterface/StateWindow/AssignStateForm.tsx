import { useActiveMap } from "@hooks/useActiveMap";
import { useAddStates, useGetCountries } from "@ipc/countries";
import { useMapStore } from "@store/store";
import { FormItem } from "@ui/Form";
import { Label } from "@ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";

const AssignStateForm = () => {
    const activeMap = useActiveMap();
    const selectedState = useMapStore((state) => state.selectedState)!;
    const { data: countries } = useGetCountries(activeMap.id);
    const stateCountry = countries?.find((country) => country.states.includes(selectedState.id));
    const assignState = useAddStates(activeMap.id);

    const assignStateHandler = (tag: string) => {
        assignState.mutateAsync({ countryTag: tag, states: [selectedState.id] });
    };

    return (
        <FormItem>
            <Label>Owner</Label>
            <Select onValueChange={assignStateHandler} value={stateCountry?.tag}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="State Owner" />
                </SelectTrigger>
                <SelectContent>
                    {countries?.map((country) => (
                        <SelectItem key={country.tag} value={country.tag}>
                            <div className="flex flex-row items-center gap-2">
                                <img
                                    src={country.flag}
                                    alt={`${country.name} flag`}
                                    className="aspect-[3/2] h-4 rounded-sm object-cover"
                                />
                                {country.name}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </FormItem>
    );
};
export default AssignStateForm;
