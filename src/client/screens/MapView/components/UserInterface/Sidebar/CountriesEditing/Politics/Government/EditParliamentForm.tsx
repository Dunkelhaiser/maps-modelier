import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useUpdateParliament } from "@ipc/government";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { ParliamentInput, parliamentSchema } from "src/shared/schemas/politics/parliament";
import { Parliament } from "src/shared/types";

interface Props {
    parliament: Parliament;
}

const EditParliamentForm = ({ parliament }: Props) => {
    const activeMap = useActiveMap();

    const defaultValues = useMemo(
        () => ({
            name: parliament.name,
            seatsNumber: parliament.seatsNumber,
        }),
        [parliament.name, parliament.seatsNumber]
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
                    <Button isLoading={form.formState.isSubmitting} className="flex-1 gap-2" disabled={isFormUnchanged}>
                        <Save />
                        Save Changes
                    </Button>
                </form>
            </Form>
        </div>
    );
};
export default EditParliamentForm;
