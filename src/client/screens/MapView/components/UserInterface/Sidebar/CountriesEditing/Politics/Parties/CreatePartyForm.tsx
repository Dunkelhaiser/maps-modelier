import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useCreateParty } from "@ipc/parties";
import { useGetPoliticians } from "@ipc/politicians";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { PartyInput, partySchema } from "src/shared/schemas/parties/party";
import IdeologiesSection from "./IdeologiesSection";

const CreatePartyForm = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const selectParty = useMapStore((state) => state.selectParty);

    const form = useForm<PartyInput>({
        resolver: zodResolver(partySchema),
        defaultValues: {
            name: "",
            acronym: "",
            color: "#808080",
            foundedAt: undefined,
            ideologies: [],
            leader: undefined,
            membersCount: 1,
        },
    });
    const colorPickerRef = useRef<HTMLInputElement>(null);

    const { data: politicians } = useGetPoliticians(activeMap, selectedCountry);
    const createParty = useCreateParty(activeMap, selectedCountry);

    const createPartyHandler = async (data: PartyInput) => {
        const createdParty = await createParty.mutateAsync(data);
        selectParty(createdParty.id);
    };

    return (
        <Form {...form}>
            <form className="flex flex-col gap-4 py-4" onSubmit={form.handleSubmit(createPartyHandler)}>
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
                                                    <div className="flex flex-row items-center gap-2">
                                                        {politician.portrait ? (
                                                            <img
                                                                src={politician.portrait}
                                                                alt={`${politician.name} portrait`}
                                                                className="aspect-[3_/_4] h-7 rounded-sm"
                                                            />
                                                        ) : (
                                                            <div className="flex aspect-[3_/_4] h-7 select-none items-center justify-center rounded-sm bg-muted text-3xl font-medium text-muted-foreground">
                                                                ?
                                                            </div>
                                                        )}
                                                        {politician.name}
                                                    </div>
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
                <Button isLoading={form.formState.isSubmitting}>Create Party</Button>
            </form>
        </Form>
    );
};
export default CreatePartyForm;
