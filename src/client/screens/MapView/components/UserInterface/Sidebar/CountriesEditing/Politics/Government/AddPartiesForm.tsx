import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useAddParties, useGetParties } from "@ipc/government";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Label } from "@ui/Label";
import { ScrollArea } from "@ui/ScrollArea";
import { Plus, Save, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { PartyFormInput, partyFormSchema } from "src/shared/schemas/politics/addParties";
import PartiesSelect from "./PartiesSelect";

interface Props {
    id: number;
}

const AddPartiesForm = ({ id }: Props) => {
    const activeMap = useActiveMap();
    const { data: parliamentParties } = useGetParties(activeMap, id);

    const defaultValues = useMemo(
        () => ({
            party:
                parliamentParties?.flatMap((group) =>
                    group.parties.map((party) => ({
                        partyId: party.id,
                        seatsNumber: party.seats,
                        side: group.side,
                    }))
                ) ?? [],
        }),
        [parliamentParties]
    );

    const form = useForm<PartyFormInput>({
        resolver: zodResolver(partyFormSchema),
        defaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues, form]);

    const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.getValues());

    const {
        fields: partyFields,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "party",
    });

    const addParties = useAddParties(activeMap, id);

    const addPartiesHandler = async (data: PartyFormInput) => {
        await addParties.mutateAsync(data.party);
    };

    const selectedParties = form.watch("party").map((p) => Number(p.partyId));

    const sides = [
        { id: "ruling_coalition", name: "Ruling Coalition" },
        { id: "neutral", name: "Neutral" },
        { id: "opposition", name: "Opposition" },
    ] as const;

    return (
        <div>
            <Form {...form}>
                <form className="grid gap-4 pt-4" onSubmit={form.handleSubmit(addPartiesHandler)}>
                    <Label className="text-lg font-medium">Parliament Parties</Label>
                    <ScrollArea viewportClassName="max-h-[50vh]">
                        <div className="space-y-6 py-1 pr-4">
                            {sides.map((side) => (
                                <div key={side.id} className="space-y-3 rounded-md border p-3">
                                    <Label className="font-medium capitalize">{side.name}</Label>
                                    <div className="space-y-3">
                                        {partyFields
                                            .map((field, index) => ({ field, index }))
                                            .filter(({ index }) => form.getValues().party[index].side === side.id)
                                            .map(({ field, index }) => {
                                                const otherSelectedParties = selectedParties.filter(
                                                    (_, i) => i !== index && selectedParties[i] !== 0
                                                );

                                                return (
                                                    <div className="flex gap-2" key={field.id}>
                                                        <FormField
                                                            control={form.control}
                                                            name={`party.${index}.partyId`}
                                                            render={({ field: formField }) => (
                                                                <FormItem className="flex-1">
                                                                    <FormControl>
                                                                        <PartiesSelect
                                                                            onChange={formField.onChange}
                                                                            value={formField.value}
                                                                            selectedParties={otherSelectedParties}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`party.${index}.seatsNumber`}
                                                            render={({ field: formField }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...formField}
                                                                            type="number"
                                                                            className="h-9 w-20"
                                                                            placeholder="Seats"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            aria-label="Remove"
                                                            size="icon"
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                        >
                                                            <X />
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => append({ partyId: 0, seatsNumber: 0, side: side.id })}
                                            className="w-full gap-2"
                                        >
                                            <Plus size={16} />
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <Button className="gap-2" isLoading={form.formState.isSubmitting} disabled={isFormUnchanged}>
                        <Save size={16} />
                        Save Parties
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AddPartiesForm;
