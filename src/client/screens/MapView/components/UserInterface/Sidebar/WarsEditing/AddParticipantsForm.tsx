import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useAddParticipants, useGetParticipants, useGetWar } from "@ipc/wars";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Label } from "@ui/Label";
import { ScrollArea } from "@ui/ScrollArea";
import { Plus, Save, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { AddParticipantsFormInput, addParticipantsFormSchema } from "src/shared/schemas/wars/addParticipants";
import ParticipantSelect from "./ParticipantSelect";

const AddParticipantsForm = () => {
    const activeMap = useActiveMap();
    const selectedWar = useMapStore((state) => state.selectedWar)!;
    const addParticipants = useAddParticipants(activeMap, selectedWar);
    const { data: participants } = useGetParticipants(activeMap, selectedWar);
    const { data: warDetails } = useGetWar(activeMap, selectedWar);

    const primaryParticipants = useMemo(() => {
        return [warDetails?.aggressor.id, warDetails?.defender.id];
    }, [warDetails]);

    const isPrimaryParticipant = (id: number) => {
        return primaryParticipants.includes(id);
    };

    const defaultValues = useMemo(() => {
        if (!participants) return { participants: [] };

        const uniqueParticipants = new Map();

        participants.sides.forEach((side) => {
            side.allianceGroups.forEach((group) => {
                group.countries.forEach((country) => {
                    if (!uniqueParticipants.has(country.id)) {
                        uniqueParticipants.set(country.id, {
                            countryId: country.id,
                            sideId: side.id,
                        });
                    }
                });
            });
        });

        return {
            participants: Array.from(uniqueParticipants.values()),
        };
    }, [participants]);

    const form = useForm<AddParticipantsFormInput>({
        resolver: zodResolver(addParticipantsFormSchema),
        defaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues, form]);

    const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.getValues());

    const {
        fields: participantsFields,
        remove,
        append,
    } = useFieldArray({
        control: form.control,
        name: "participants",
    });

    const addParticipantsHandler = async (data: AddParticipantsFormInput) => {
        await addParticipants.mutateAsync(data.participants);
    };

    const selectedParticipants = form.watch("participants").map((p) => Number(p.countryId));

    return (
        <Form {...form}>
            <form className="grid gap-4 pt-4" onSubmit={form.handleSubmit(addParticipantsHandler)}>
                <Label className="text-lg font-medium">War Participants</Label>
                <ScrollArea viewportClassName="max-h-[50vh]">
                    <div className="space-y-6 py-1 pr-4">
                        {participants?.sides.map((side) => (
                            <div key={side.id} className="space-y-3 rounded-md border p-3">
                                <Label className="font-medium capitalize">{side.name}</Label>
                                <div className="space-y-3">
                                    {participantsFields
                                        .map((field, index) => ({ field, index }))
                                        .filter(({ index }) => form.getValues().participants[index].sideId === side.id)
                                        .map(({ field, index }) => {
                                            const otherSelectedParticipants = selectedParticipants.filter(
                                                (_, i) => i !== index && selectedParticipants[i] !== -1
                                            );
                                            const isPrimary = isPrimaryParticipant(
                                                form.getValues().participants[index].countryId
                                            );

                                            return (
                                                <div className="flex gap-2" key={field.id}>
                                                    <FormField
                                                        control={form.control}
                                                        name={`participants.${index}.countryId`}
                                                        render={({ field: formField }) => (
                                                            <FormItem className="flex-1">
                                                                <FormControl>
                                                                    <ParticipantSelect
                                                                        onChange={formField.onChange}
                                                                        value={formField.value}
                                                                        selectedParticipants={otherSelectedParticipants}
                                                                        isPrimary={isPrimary}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        aria-label="Remove"
                                                        size="icon"
                                                        disabled={isPrimary}
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
                                        onClick={() => append({ countryId: -1, sideId: side.id })}
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

                <Button isLoading={form.formState.isSubmitting} disabled={isFormUnchanged} className="gap-2">
                    <Save size={16} />
                    Save Participants
                </Button>
            </form>
        </Form>
    );
};

export default AddParticipantsForm;
