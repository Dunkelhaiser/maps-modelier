import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useUpdateCountry } from "@ipc/countries";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import FileUpload from "@ui/FileUpload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UpdateCountryInput, updateCountrySchema } from "./countrySchema";

const EditCountryForm = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const selectCountry = useMapStore((state) => state.selectCountry);
    const form = useForm<UpdateCountryInput>({
        resolver: zodResolver(updateCountrySchema),
        defaultValues: {
            name: selectedCountry.name,
            tag: selectedCountry.tag,
            color: selectedCountry.color,
            anthem: {
                url: undefined,
                name: selectedCountry.anthem.name,
            },
            flag: undefined,
            coatOfArms: undefined,
        },
    });
    const flagRef = form.register("flag");
    const coatOfArmsRef = form.register("coatOfArms");
    const anthemRef = form.register("anthem.url");

    useEffect(() => {
        form.reset({
            name: selectedCountry.name,
            tag: selectedCountry.tag,
            color: selectedCountry.color,
            anthem: {
                url: undefined,
                name: selectedCountry.anthem.name,
            },
            flag: undefined,
            coatOfArms: undefined,
        });
    }, [form, selectedCountry.anthem.name, selectedCountry.color, selectedCountry.name, selectedCountry.tag]);

    const updateCountry = useUpdateCountry(activeMap.id, selectedCountry.tag);

    const updateCountryHandler = async (data: UpdateCountryInput) => {
        const updatedCountry = await updateCountry.mutateAsync(data);
        selectCountry(updatedCountry);
    };

    return (
        <Form {...form}>
            <form className="flex flex-col gap-4 py-4" onSubmit={form.handleSubmit(updateCountryHandler)}>
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
                                        defaultImg={selectedCountry.flag}
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
                                        defaultImg={selectedCountry.coatOfArms}
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
                        name="anthem.url"
                        render={() => (
                            <FormItem className="w-full grow">
                                <FormLabel>Anthem</FormLabel>
                                <FormControl>
                                    <Input type="file" className="h-8" {...anthemRef} accept="audio/*" />
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
                                    <Input className="h-8" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <FormField
                        control={form.control}
                        name="tag"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tag</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter country tag" className="h-8" {...field} />
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
                                    <Input type="color" className="h-8 w-12" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button isLoading={form.formState.isSubmitting}>Save</Button>
            </form>
        </Form>
    );
};
export default EditCountryForm;
