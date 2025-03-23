import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountriesBase } from "@ipc/countries";
import { useCreateWar } from "@ipc/wars";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { useForm, useWatch } from "react-hook-form";
import { WarInput, warSchema } from "src/shared/schemas/wars/war";

const CreateWarForm = () => {
    const activeMap = useActiveMap();
    const selectWar = useMapStore((state) => state.selectWar);
    const { data: countries } = useGetCountriesBase(activeMap);

    const form = useForm<WarInput>({
        resolver: zodResolver(warSchema),
        defaultValues: {
            name: "",
            aggressor: undefined,
            defender: undefined,
            startedAt: undefined,
            endedAt: undefined,
        },
    });

    const aggressor = useWatch({ control: form.control, name: "aggressor" });
    const defender = useWatch({ control: form.control, name: "defender" });

    const aggressorOptions = countries?.filter((country) => String(country.id) !== String(defender));
    const defenderOptions = countries?.filter((country) => String(country.id) !== String(aggressor));

    const createWar = useCreateWar(activeMap);

    const createWarHandler = async (data: WarInput) => {
        const createdWar = await createWar.mutateAsync(data);
        selectWar(createdWar.id);
    };

    return (
        <Form {...form}>
            <form className="flex flex-col gap-4 py-4" onSubmit={form.handleSubmit(createWarHandler)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter war name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-2">
                    <FormField
                        control={form.control}
                        name="aggressor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Aggressor</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={String(field.value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Aggressor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {aggressorOptions?.map((country) => (
                                                <SelectItem key={country.id} value={String(country.id)}>
                                                    <div className="flex flex-row items-center gap-2">
                                                        <img
                                                            src={country.flag}
                                                            alt={`${country.name} flag`}
                                                            className="aspect-[3/2] h-4 rounded-sm object-cover"
                                                        />
                                                        {country.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="defender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Defender</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={String(field.value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Defender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {defenderOptions?.map((country) => (
                                                <SelectItem key={country.id} value={String(country.id)}>
                                                    <div className="flex flex-row items-center gap-2">
                                                        <img
                                                            src={country.flag}
                                                            alt={`${country.name} flag`}
                                                            className="aspect-[3/2] h-4 rounded-sm object-cover"
                                                        />
                                                        {country.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <FormField
                        control={form.control}
                        name="startedAt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Started At</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={
                                            field.value instanceof Date
                                                ? field.value.toISOString().split("T")[0]
                                                : field.value
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endedAt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ended At</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={
                                            field.value instanceof Date
                                                ? field.value.toISOString().split("T")[0]
                                                : field.value
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button isLoading={form.formState.isSubmitting}>Create War</Button>
            </form>
        </Form>
    );
};
export default CreateWarForm;
