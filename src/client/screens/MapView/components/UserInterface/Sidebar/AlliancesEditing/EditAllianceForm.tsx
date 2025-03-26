import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetAlliance, useGetMembers, useUpdateAlliance } from "@ipc/alliances";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { AllianceInput, allianceSchema } from "src/shared/schemas/alliances/alliance";
import AddMembersForm from "./AddMembersForm";
import DeleteAllianceDialog from "./DeleteAllianceDialog";

const EditAllianceForm = () => {
    const activeMap = useActiveMap();
    const selectAlliance = useMapStore((state) => state.selectAlliance);
    const selectedAlliance = useMapStore((state) => state.selectedAlliance)!;
    const { data: alliance } = useGetAlliance(activeMap, selectedAlliance);
    const { data: members } = useGetMembers(activeMap, selectedAlliance);

    const defaultValues = useMemo(
        () => ({
            name: alliance?.name,
            leader: alliance?.leader.id,
            type: alliance?.type as "economic" | "political" | "military",
        }),
        [alliance?.name, alliance?.leader.id, alliance?.type]
    );

    const form = useForm<AllianceInput>({
        resolver: zodResolver(allianceSchema),
        defaultValues,
    });

    const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.getValues());

    useEffect(() => {
        form.reset(defaultValues);
    }, [form, defaultValues]);

    const updateAlliance = useUpdateAlliance(activeMap, selectedAlliance);

    const updateAllianceHandler = async (data: AllianceInput) => {
        const updatedAlliance = await updateAlliance.mutateAsync(data);
        selectAlliance(updatedAlliance.id);
    };

    return (
        <>
            <Form {...form}>
                <form className="flex flex-col gap-4 py-4" onSubmit={form.handleSubmit(updateAllianceHandler)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter alliance name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Alliance Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="economic">Economic</SelectItem>
                                                <SelectItem value="political">Political</SelectItem>
                                                <SelectItem value="military">Military</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                                {members?.map((country) => (
                                                    <SelectItem key={country.id} value={String(country.id)}>
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
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="mt-6 flex gap-2">
                        <Button
                            isLoading={form.formState.isSubmitting}
                            className="flex-1 gap-2"
                            disabled={isFormUnchanged}
                        >
                            <Save />
                            Save Changes
                        </Button>
                        <DeleteAllianceDialog mapId={activeMap} id={selectedAlliance} />
                    </div>
                </form>
            </Form>
            <AddMembersForm members={members} leaderId={alliance?.leader.id} />
        </>
    );
};
export default EditAllianceForm;
