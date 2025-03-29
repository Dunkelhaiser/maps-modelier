import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetMembers, useGetParty, useUpdateParty } from "@ipc/parties";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { formatLocalDate } from "@utils/utils";
import { Save } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { PartyInput, partySchema } from "src/shared/schemas/parties/party";
import IdeologiesSection from "./IdeologiesSection";

const EditPartyForm = () => {
    const activeMap = useActiveMap();
    const selectedParty = useMapStore((state) => state.selectedParty)!;
    const { data: party } = useGetParty(activeMap, selectedParty);

    const defaultValues = useMemo(
        () => ({
            name: party?.name,
            acronym: party?.acronym ?? "",
            color: party?.color,
            foundedAt: (formatLocalDate(party?.foundedAt) as unknown as Date | null) ?? undefined,
            ideologies: party
                ? [
                      {
                          ideologyId: party.primaryIdeology.id,
                          isPrimary: true,
                      },
                  ].concat(
                      party.ideologies
                          .filter((ideology) => ideology.id !== party.primaryIdeology.id)
                          .map((ideology) => ({
                              ideologyId: ideology.id,
                              isPrimary: false,
                          }))
                  )
                : [],
            leader: party?.leader.id,
            membersCount: party?.membersCount,
        }),
        [party]
    );

    const form = useForm<PartyInput>({
        resolver: zodResolver(partySchema),
        defaultValues,
    });
    const colorPickerRef = useRef<HTMLInputElement>(null);

    const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.getValues());

    useEffect(() => {
        form.reset(defaultValues);
    }, [form, defaultValues]);

    const { data: politicians } = useGetMembers(activeMap, selectedParty);
    const updateParty = useUpdateParty(activeMap, selectedParty);

    const updatePartyHandler = async (data: PartyInput) => {
        await updateParty.mutateAsync(data);
    };

    return (
        <Form {...form}>
            <form className="flex flex-col gap-4 py-4" onSubmit={form.handleSubmit(updatePartyHandler)}>
                <div className="grid grid-cols-[1fr_0.35fr_0.1fr] gap-2">
                    <div className="inline-flex items-center gap-2">
                        <button
                            type="button"
                            className="size-6 rounded-full"
                            style={{ backgroundColor: form.watch("color") }}
                            onClick={() => colorPickerRef.current?.click()}
                        />
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem className="invisible size-0">
                                    <FormControl>
                                        <Input type="color" {...field} ref={colorPickerRef} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter party name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="acronym"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Acronym</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="membersCount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Members</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" placeholder="Enter members count" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <FormField
                        control={form.control}
                        name="leader"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leader</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={String(field.value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Leader" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {politicians?.map((politician) => (
                                                <SelectItem key={politician.id} value={String(politician.id)}>
                                                    {politician.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="foundedAt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Founded At</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        value={
                                            field.value instanceof Date
                                                ? field.value.toISOString().split("T")[0]
                                                : field.value
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <IdeologiesSection form={form} />
                <Button isLoading={form.formState.isSubmitting} className="flex-1 gap-2" disabled={isFormUnchanged}>
                    <Save />
                    Save Changes
                </Button>
            </form>
        </Form>
    );
};
export default EditPartyForm;
