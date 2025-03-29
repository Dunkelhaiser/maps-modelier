import { Button } from "@ui/Button";
import { FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Label } from "@ui/Label";
import { ScrollArea } from "@ui/ScrollArea";
import { Plus, X } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { PartyInput } from "src/shared/schemas/parties/party";
import IdeologiesSelect from "./IdeologiesSelect";

interface Props {
    form: UseFormReturn<PartyInput>;
}

const IdeologiesSection = ({ form }: Props) => {
    const {
        fields: ideologiesField,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "ideologies",
    });

    const selectedIdeologies = form.watch("ideologies").map((i) => Number(i.ideologyId));
    const hasPrimaryIdeology = form.watch("ideologies").some((ideology) => ideology.isPrimary);

    return (
        <div className="flex flex-col items-start gap-2">
            <Label>Ideologies</Label>
            <ScrollArea viewportClassName="max-h-[50vh]">
                <div className="space-y-4 py-1 pr-4">
                    {ideologiesField.map((ideologyField, index) => {
                        const otherSelectedIdeologies = selectedIdeologies.filter(
                            (_, i) => i !== index && selectedIdeologies[i] !== 0
                        );
                        const isPrimary = form.watch(`ideologies.${index}.isPrimary`);
                        const showPrimaryCheckbox = !hasPrimaryIdeology || isPrimary;

                        return (
                            <div className="flex gap-2" key={ideologyField.id}>
                                <FormField
                                    control={form.control}
                                    name={`ideologies.${index}.ideologyId`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <IdeologiesSelect
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                    selectedIdeologies={otherSelectedIdeologies}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {showPrimaryCheckbox && (
                                    <FormField
                                        control={form.control}
                                        name={`ideologies.${index}.isPrimary`}
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-2">
                                                <Label>Primary</Label>
                                                <FormControl>
                                                    {/* @ts-expect-error incorrect type inference */}
                                                    <Input {...field} type="checkbox" checked={field.value} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <Button variant="ghost" aria-label="Remove" size="icon" onClick={() => remove(index)}>
                                    <X />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
            <Button
                className="flex-1 gap-2"
                type="button"
                variant="ghost"
                onClick={() => append({ ideologyId: 0, isPrimary: false })}
            >
                <Plus />
                Add Ideology
            </Button>
        </div>
    );
};
export default IdeologiesSection;
