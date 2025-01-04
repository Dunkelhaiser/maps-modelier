import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useCreateCountry } from "@ipc/countries";
import { useSidebarStore } from "@store/sidebar";
import { Button } from "@ui/Button";
import FileUpload from "@ui/FileUpload";
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
            anthem: {
                audio: undefined,
                name: "",
            },
            flag: undefined,
            coatOfArms: undefined,
        },
    });
    const flagRef = form.register("flag");
    const coatOfArmsRef = form.register("coatOfArms");
    const anthemRef = form.register("anthem.audio");

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
                <div className="flex flex-row gap-4">
                    <FormField
                        control={form.control}
                        name="flag"
                        render={() => (
                            <FormItem>
                                <FormLabel>Flag</FormLabel>
                                <FormControl>
                                    <FileUpload
                                        className="aspect-[3/2] h-36"
                                        {...flagRef}
                                        accept="image/png, image/jpg, image/jpeg, image/webp, image/bmp"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="coatOfArms"
                        render={() => (
                            <FormItem>
                                <FormLabel>Coat of arms</FormLabel>
                                <FormControl>
                                    <FileUpload
                                        className="aspect-square h-36"
                                        {...coatOfArmsRef}
                                        accept="image/png, image/jpg, image/jpeg, image/webp, image/bmp"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <FormField
                        control={form.control}
                        name="anthem.audio"
                        render={() => (
                            <FormItem className="w-full grow">
                                <FormLabel>Anthem</FormLabel>
                                <FormControl>
                                    <Input type="file" {...anthemRef} accept="audio/*" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="anthem.name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Anthem name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
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
