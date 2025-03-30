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
import SideSelect from "./SideSelect";

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

    return (
        <div>
            <Form {...form}>
                <form className="grid gap-4 pt-4" onSubmit={form.handleSubmit(addPartiesHandler)}>
                    <Label>Parties</Label>
                    <ScrollArea viewportClassName="max-h-[50vh]">
                        <div className="space-y-4 py-1 pr-4">
                            {partyFields.map((partyField, index) => {
                                const otherSelectedEthnicities = selectedParties.filter(
                                    (_, i) => i !== index && selectedParties[i] !== 0
                                );

                                return (
                                    <div className="flex gap-2" key={partyField.id}>
                                        <FormField
                                            control={form.control}
                                            name={`party.${index}.partyId`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <PartiesSelect
                                                            onChange={field.onChange}
                                                            value={field.value}
                                                            selectedParties={otherSelectedEthnicities}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`party.${index}.seatsNumber`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input {...field} type="number" className="h-9 min-w-9" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`party.${index}.side`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <SideSelect onChange={field.onChange} value={field.value} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            variant="ghost"
                                            aria-label="Remove"
                                            size="icon"
                                            onClick={() => remove(index)}
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>

                    <div className="flex gap-2">
                        <Button
                            className="flex-1 gap-2"
                            type="button"
                            onClick={() => append({ partyId: 0, seatsNumber: 0, side: "neutral" })}
                        >
                            <Plus />
                            Add Party
                        </Button>
                        <Button
                            className="flex-1 gap-2"
                            isLoading={form.formState.isSubmitting}
                            disabled={isFormUnchanged}
                        >
                            <Save />
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
export default AddPartiesForm;
