import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useCreateParliament } from "@ipc/government";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { useForm } from "react-hook-form";
import { ParliamentInput, parliamentSchema } from "src/shared/schemas/politics/parliament";

const CreateParliamentForm = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;

    const form = useForm<ParliamentInput>({
        resolver: zodResolver(parliamentSchema),
        defaultValues: {
            name: "",
            seatsNumber: 0,
            oppositionLeaderId: undefined,
            coalitionLeaderId: undefined,
        },
    });

    const createParliament = useCreateParliament(activeMap, selectedCountry);

    const createParliamentHandler = async (data: ParliamentInput) => {
        await createParliament.mutateAsync(data);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Parliament</h3>
            <Form {...form}>
                <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(createParliamentHandler)}>
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
                    <Button isLoading={form.formState.isSubmitting}>Create</Button>
                </form>
            </Form>
        </div>
    );
};
export default CreateParliamentForm;
