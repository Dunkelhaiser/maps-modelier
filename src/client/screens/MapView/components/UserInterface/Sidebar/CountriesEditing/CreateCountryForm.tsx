import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useCreateCountry } from "@ipc/countries";
import { useSidebarStore } from "@store/sidebar";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { useForm } from "react-hook-form";
import { CountryInput, countrySchema } from "./countrySchema";

const CreateCountryForm = () => {
    const activeMap = useActiveMap();
    const setScreen = useSidebarStore((state) => state.setScreen);
    const form = useForm<CountryInput>({
        resolver: zodResolver(countrySchema),
        defaultValues: {
            name: "",
            tag: "",
            color: "",
        },
    });

    const createCountry = useCreateCountry(activeMap.id);

    const createCountryHandler = async (data: CountryInput) => {
        await createCountry.mutateAsync(data);
        setScreen("countries");
    };

    return (
        <Form {...form}>
            <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(createCountryHandler)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter country name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tag</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter country tag" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter country color" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button isLoading={form.formState.isSubmitting}>Create Country</Button>
            </form>
        </Form>
    );
};
export default CreateCountryForm;
