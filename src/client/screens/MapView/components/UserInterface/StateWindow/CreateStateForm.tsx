import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateState } from "@ipc/states";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { NameInput, nameSchema } from "@utils/sharedSchemas";
import { useForm } from "react-hook-form";

const CreateStateForm = () => {
    const form = useForm<NameInput>({
        resolver: zodResolver(nameSchema),
        defaultValues: {
            name: "",
        },
    });
    const activeMap = useMapStore((state) => state.activeMap)!;
    const selectedProvince = useMapStore((state) => state.selectedProvinces);
    const createState = useCreateState(activeMap.id);

    const createStateHanlder = (data: NameInput) => {
        const selectedProvincesIds = selectedProvince.map((province) => province.id);
        createState.mutateAsync({ name: data.name, provinces: selectedProvincesIds });
    };

    return (
        <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(createStateHanlder)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter state name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button isLoading={form.formState.isSubmitting}>Create State</Button>
            </form>
        </Form>
    );
};
export default CreateStateForm;
