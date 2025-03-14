import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetAlliance, useGetMembers, useUpdateAlliance } from "@ipc/alliances";
import { useGetCountries } from "@ipc/countries";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { useForm } from "react-hook-form";
import { AllianceInput, allianceSchema } from "src/shared/schemas/alliances/alliance";
import AddMembersForm from "./AddMembersForm";

const EditAllianceForm = () => {
    const activeMap = useActiveMap();
    const selectAlliance = useMapStore((state) => state.selectAlliance);
    const selectedAlliance = useMapStore((state) => state.selectedAlliance)!;
    const { data: alliance } = useGetAlliance(activeMap.id, selectedAlliance);
    const { data: members } = useGetMembers(activeMap.id, selectedAlliance);

    const form = useForm<AllianceInput>({
        resolver: zodResolver(allianceSchema),
        defaultValues: {
            name: alliance?.name,
            leader: alliance?.leader.tag,
            type: alliance?.type as "economic" | "political" | "military",
        },
    });

    const { data: countries } = useGetCountries(activeMap.id);
    const updateAlliance = useUpdateAlliance(activeMap.id, selectedAlliance);

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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Leader" />
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
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button isLoading={form.formState.isSubmitting}>Save</Button>
                </form>
            </Form>
            <AddMembersForm members={members} leaderTag={alliance?.leader.tag} />
        </>
    );
};
export default EditAllianceForm;
