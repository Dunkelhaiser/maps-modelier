import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useAddMembers } from "@ipc/alliances";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Label } from "@ui/Label";
import { ScrollArea } from "@ui/ScrollArea";
import { Plus, Save, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { AddMembersFormInput, addMembersFormSchema, AddMembersInput } from "src/shared/schemas/alliances/addMembers";
import { CountryBase } from "src/shared/types";
import MembersSelect from "./MembersSelect";

interface Props {
    members?: CountryBase[];
    leaderId?: number;
}

const AddMembersForm = ({ members, leaderId }: Props) => {
    const activeMap = useActiveMap();
    const selectedAlliance = useMapStore((state) => state.selectedAlliance)!;
    const addMembers = useAddMembers(activeMap, selectedAlliance);

    const defaultValues = useMemo(
        () => ({
            members: members?.map((member) => ({ itemId: member.id })) ?? [],
        }),
        [members]
    );

    const form = useForm<AddMembersFormInput>({
        resolver: zodResolver(addMembersFormSchema),
        defaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues, form]);

    const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.getValues());

    const {
        fields: membersField,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "members",
    });

    const addMembersHandler = async (data: AddMembersFormInput) => {
        await addMembers.mutateAsync(data.members.map((member) => member.itemId) as AddMembersInput);
    };

    const selectedMembers = form.watch("members").map((member) => Number(member.itemId));

    return (
        <Form {...form}>
            <form className="grid gap-4 pt-4" onSubmit={form.handleSubmit(addMembersHandler)}>
                <Label>Members</Label>
                <ScrollArea viewportClassName="max-h-[50vh]">
                    <div className="space-y-4 py-1 pr-4">
                        {membersField.map((memberField, index) => {
                            const otherSelectedMembers = selectedMembers.filter(
                                (_, i) => i !== index && selectedMembers[i] !== -1
                            );

                            return (
                                <div className="flex gap-2" key={memberField.id}>
                                    <FormField
                                        control={form.control}
                                        name={`members.${index}.itemId`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <MembersSelect
                                                        onChange={field.onChange}
                                                        value={field.value}
                                                        selectedMembers={otherSelectedMembers}
                                                        isLeader={memberField.itemId === leaderId}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {memberField.itemId !== leaderId && (
                                        <Button
                                            variant="ghost"
                                            aria-label="Remove"
                                            size="icon"
                                            onClick={() => remove(index)}
                                        >
                                            <X />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                <div className="flex gap-2">
                    <Button type="button" onClick={() => append({ itemId: -1 })} className="flex-1 gap-2">
                        <Plus />
                        Add Member
                    </Button>
                    <Button isLoading={form.formState.isSubmitting} disabled={isFormUnchanged} className="flex-1 gap-2">
                        <Save />
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    );
};
export default AddMembersForm;
