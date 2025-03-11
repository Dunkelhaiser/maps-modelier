import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useCreateState } from "@ipc/states";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { useForm } from "react-hook-form";
import { StateInput, stateSchema } from "src/shared/schemas/states/state";

const CreateStateForm = () => {
    const form = useForm<StateInput>({
        resolver: zodResolver(stateSchema),
        defaultValues: {
            name: "",
        },
    });
    const activeMap = useActiveMap();
    const selectedProvince = useMapStore((state) => state.selectedProvinces);
    const createState = useCreateState(activeMap.id);

    const createStateHanlder = (data: StateInput) => {
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
