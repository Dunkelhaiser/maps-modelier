import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useUpdateParliament } from "@ipc/government";
import { useGetPoliticians } from "@ipc/politicians";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { ParliamentInput, parliamentSchema } from "src/shared/schemas/politics/parliament";
import { Parliament } from "src/shared/types";
import AddPartiesForm from "./AddPartiesForm";

interface Props {
    parliament: Parliament;
}

const EditParliamentForm = ({ parliament }: Props) => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const { data: politicians } = useGetPoliticians(activeMap, selectedCountry);

    const defaultValues = useMemo(
        () => ({
            name: parliament.name,
            seatsNumber: parliament.seatsNumber,
            oppositionLeaderId: parliament.oppositionLeader?.id,
            coalitionLeaderId: parliament.coalitionLeader?.id,
        }),
        [parliament.coalitionLeader, parliament.name, parliament.oppositionLeader, parliament.seatsNumber]
    );

    const form = useForm<ParliamentInput>({
        resolver: zodResolver(parliamentSchema),
        defaultValues,
    });

    const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.getValues());

    useEffect(() => {
        form.reset(defaultValues);
    }, [form, defaultValues]);

    const updateParliament = useUpdateParliament(activeMap, parliament.id);

    const updateParliamentHandler = async (data: ParliamentInput) => {
        await updateParliament.mutateAsync(data);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Parliament</h3>
            <Form {...form}>
                <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(updateParliamentHandler)}>
                    <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter parliament name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="seatsNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Seats Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" placeholder="Enter number of seats" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name="coalitionLeaderId"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Coalition Leader</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={String(field.value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Coalition leader" />
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
                            name="oppositionLeaderId"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Opposition Leader</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={String(field.value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Opposition leader" />
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
                    </div>
                    <Button isLoading={form.formState.isSubmitting} className="flex-1 gap-2" disabled={isFormUnchanged}>
                        <Save />
                        Save Changes
                    </Button>
                </form>
            </Form>
            <AddPartiesForm id={parliament.id} />
        </div>
    );
};
export default EditParliamentForm;
