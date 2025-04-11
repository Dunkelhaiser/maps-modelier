import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountryById, useUpdateCountry } from "@ipc/countries";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import FileUpload from "@ui/FileUpload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Save } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { UpdateCountryInput, updateCountrySchema } from "src/shared/schemas/countries/updateCountry";
import DeleteCountryDialog from "./DeleteCountryDialog";

const EditAttributesForm = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;

    const { data: country } = useGetCountryById(activeMap, selectedCountry);

    const defaultValues = useMemo(
        () => ({
            name: {
                common: country?.name.common,
                official: country?.name.official ?? "",
            },
            color: country?.color,
            anthem: {
                url: "",
                name: country?.anthem?.name ?? "",
            },
            flag: "",
            coatOfArms: "",
        }),
        [country?.anthem?.name, country?.color, country?.name.common, country?.name.official]
    );

    const form = useForm<UpdateCountryInput>({
        resolver: zodResolver(updateCountrySchema),
        defaultValues,
    });
    const flagRef = form.register("flag");
    const coatOfArmsRef = form.register("coatOfArms");
    const anthemRef = form.register("anthem.url");
    const colorPickerRef = useRef<HTMLInputElement>(null);

    const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.getValues());

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const flagInput = document.querySelector('input[name="flag"]') as HTMLInputElement | null;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const coatOfArmsInput = document.querySelector('input[name="coatOfArms"]') as HTMLInputElement | null;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const anthemInput = document.querySelector('input[name="anthem.url"]') as HTMLInputElement | null;

        if (flagInput) flagInput.value = "";
        if (coatOfArmsInput) coatOfArmsInput.value = "";
        if (anthemInput) anthemInput.value = "";

        form.reset(defaultValues);
    }, [defaultValues, form]);

    const updateCountry = useUpdateCountry(activeMap, selectedCountry);

    const updateCountryHandler = async (data: UpdateCountryInput) => {
        await updateCountry.mutateAsync(data);
    };

    if (!country) {
        return <p className="p-4 text-center">Loading country data...</p>;
    }

    return (
        <Form {...form}>
            <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(updateCountryHandler)}>
                <div className="flex flex-col gap-3">
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
                            name="name.common"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Common name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter common name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name.official"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel optional>Official name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter official name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="mt-2 flex flex-col gap-3">
                    <div className="flex gap-3">
                        <FormField
                            control={form.control}
                            name="flag"
                            render={() => (
                                <FormItem className="flex-1">
                                    <FormLabel>Flag</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            className="h-32 w-auto"
                                            defaultImg={country.flag}
                                            resetKey={selectedCountry}
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
                                <FormItem className="flex-1">
                                    <FormLabel optional>Coat of Arms</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            className="aspect-square h-32 w-auto"
                                            object="contain"
                                            defaultImg={country.coatOfArms}
                                            resetKey={selectedCountry}
                                            {...coatOfArmsRef}
                                            accept="image/png, image/jpg, image/jpeg, image/webp, image/bmp"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <FormLabel optional>National Anthem</FormLabel>
                        <div className="flex flex-row gap-2">
                            <FormField
                                control={form.control}
                                name="anthem.url"
                                render={() => (
                                    <FormItem className="">
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
                                    <FormItem className="">
                                        <FormControl>
                                            <Input placeholder="Anthem name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    <Button isLoading={form.formState.isSubmitting} className="flex-1 gap-2" disabled={isFormUnchanged}>
                        <Save />
                        Save Changes
                    </Button>

                    <DeleteCountryDialog mapId={activeMap} id={selectedCountry} />
                </div>
            </form>
        </Form>
    );
};

export default EditAttributesForm;
