import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useCreateCountry } from "@ipc/countries";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import FileUpload from "@ui/FileUpload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { CreateCountryInput, createCountrySchema } from "src/shared/schemas/countries/createCountry";

const CreateCountryForm = () => {
    const activeMap = useActiveMap();
    const selectCountry = useMapStore((state) => state.selectCountry);
    const form = useForm<CreateCountryInput>({
        resolver: zodResolver(createCountrySchema),
        defaultValues: {
            name: "",
            color: "#39654a",
            flag: undefined,
        },
    });
    const flagRef = form.register("flag");
    const colorPickerRef = useRef<HTMLInputElement>(null);

    const createCountry = useCreateCountry(activeMap);

    const createCountryHandler = async (data: CreateCountryInput) => {
        const createdCountry = await createCountry.mutateAsync(data);
        selectCountry(createdCountry.id);
    };

    return (
        <Form {...form}>
            <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(createCountryHandler)}>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="size-6 rounded-full"
                        style={{ backgroundColor: form.watch("color") }}
                        onClick={() => colorPickerRef.current?.click()}
                    />
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem className="invisible size-0">
                                <FormControl>
                                    <Input type="color" {...field} ref={colorPickerRef} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Common name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter common name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-3">
                    <FormField
                        control={form.control}
                        name="flag"
                        render={() => (
                            <FormItem className="flex-1">
                                <FormLabel>Flag</FormLabel>
                                <FormControl>
                                    <FileUpload
                                        className="h-32"
                                        {...flagRef}
                                        accept="image/png, image/jpg, image/jpeg, image/webp, image/bmp"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="aspect-square h-32 w-auto flex-1" />
                </div>
                <Button isLoading={form.formState.isSubmitting}>Create Country</Button>
            </form>
        </Form>
    );
};
export default CreateCountryForm;
