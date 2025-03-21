/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useDeleteCountry, useGetCountryById, useUpdateCountry } from "@ipc/countries";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import FileUpload from "@ui/FileUpload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Trash, Save } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { UpdateCountryInput, updateCountrySchema } from "src/shared/schemas/countries/updateCountry";

const EditCountryForm = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const selectCountry = useMapStore((state) => state.selectCountry);

    const { data: country } = useGetCountryById(activeMap, selectedCountry);

    const form = useForm<UpdateCountryInput>({
        resolver: zodResolver(updateCountrySchema),
        defaultValues: {
            name: {
                common: country?.name.common,
                official: country?.name.official ?? "",
            },
            color: country?.color,
            anthem: {
                url: undefined,
                name: country?.anthem?.name ?? "",
            },
            flag: undefined,
            coatOfArms: undefined,
        },
    });
    const flagRef = form.register("flag");
    const coatOfArmsRef = form.register("coatOfArms");
    const anthemRef = form.register("anthem.url");
    const colorPickerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const flagInput = document.querySelector('input[name="flag"]') as HTMLInputElement;
        const coatOfArmsInput = document.querySelector('input[name="coatOfArms"]') as HTMLInputElement;
        const anthemInput = document.querySelector('input[name="anthem.url"]') as HTMLInputElement;

        flagInput.value = "";
        coatOfArmsInput.value = "";
        anthemInput.value = "";

        form.reset({
            name: {
                common: country?.name.common,
                official: country?.name.official ?? "",
            },
            color: country?.color,
            anthem: {
                url: undefined,
                name: country?.anthem?.name ?? "",
            },
            flag: undefined,
            coatOfArms: undefined,
        });
    }, [form, country?.anthem?.name, country?.color, country?.name.common, country?.name.official]);

    const updateCountry = useUpdateCountry(activeMap, selectedCountry);

    const updateCountryHandler = async (data: UpdateCountryInput) => {
        await updateCountry.mutateAsync(data);
    };

    const deleteCountry = useDeleteCountry(activeMap, selectedCountry);

    const deleteCountryHandler = async () => {
        await deleteCountry.mutateAsync();
        selectCountry(null);
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
                                    <FormLabel>Official name</FormLabel>
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
                                    <FormLabel>Coat of Arms</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            className="aspect-square h-32 w-auto"
                                            object="contain"
                                            defaultImg={country.coatOfArms}
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
                        <FormLabel>National Anthem</FormLabel>
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

                {/* <div className="mt-4">
                    <h3 className="mb-2 text-lg font-semibold">Demographics (View Only)</h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 rounded-md bg-muted p-3 shadow-sm">
                            <div className="rounded-full bg-muted-foreground/10 p-2">
                                <Users size={16} className="text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Population</p>
                                <p className="font-medium">{country.population.toLocaleString()}</p>
                            </div>
                        </div>
                        <EthnicityBar ethnicities={country.ethnicities} />
                    </div>

                    <Table className="mt-3 max-h-40">
                        <TableHeader>
                            <TableHead>Ethnicity</TableHead>
                            <TableHead className="text-right">Population</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                        </TableHeader>
                        <TableBody>
                            {country.ethnicities.map((ethnicity) => (
                                <TableRow key={ethnicity.id}>
                                    <TableCell className="flex items-center gap-2">
                                        <div
                                            className="size-3 rounded-full"
                                            style={{ backgroundColor: ethnicity.color }}
                                        />
                                        {ethnicity.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {ethnicity.population.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {((ethnicity.population / country.population) * 100).toFixed(2)}%
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {country.alliances.length > 0 && (
                    <div className="mt-4">
                        <h3 className="mb-2 text-lg font-semibold">Alliances (View Only)</h3>
                        <div className="flex flex-wrap gap-2">
                            {country.alliances.map((alliance) => (
                                <div
                                    key={alliance.id}
                                    className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground"
                                >
                                    <span>{alliance.name}</span>
                                    <span className="rounded-full bg-muted-foreground/15 px-1.5 py-0.5 text-xs font-medium">
                                        {alliance.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )} */}

                <div className="mt-6 flex gap-2">
                    <Button isLoading={form.formState.isSubmitting} className="flex-1 gap-2">
                        <Save size={16} />
                        Save Changes
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        aria-label="Delete Country"
                        onClick={deleteCountryHandler}
                        isLoading={deleteCountry.isPending}
                    >
                        <Trash size={16} />
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default EditCountryForm;
