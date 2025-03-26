import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountriesBase } from "@ipc/countries";
import { useGetWar, useUpdateWar } from "@ipc/wars";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { formatLocalDateTime } from "@utils/utils";
import { Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { WarInput, warSchema } from "src/shared/schemas/wars/war";
import AddParticipantsForm from "./AddParticipantsForm";
import DeleteWarDialog from "./DeleteWarDialog";

const EditWarForm = () => {
    const activeMap = useActiveMap();
    const selectedWar = useMapStore((state) => state.selectedWar)!;
    const { data: countries } = useGetCountriesBase(activeMap);
    const { data: war } = useGetWar(activeMap, selectedWar);

    const defaultValues = useMemo(
        () => ({
            name: war?.name,
            aggressor: war?.aggressor.id,
            defender: war?.defender.id,
            startedAt: formatLocalDateTime(war?.startedAt) as unknown as Date,
            endedAt: (formatLocalDateTime(war?.endedAt) as unknown as Date | null) ?? undefined,
        }),
        [war?.name, war?.aggressor.id, war?.defender.id, war?.startedAt, war?.endedAt]
    );

    const form = useForm<WarInput>({
        resolver: zodResolver(warSchema),
        defaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues);
    }, [form, defaultValues]);

    const aggressor = useWatch({ control: form.control, name: "aggressor" });
    const defender = useWatch({ control: form.control, name: "defender" });

    const aggressorOptions = countries?.filter((country) => String(country.id) !== String(defender));
    const defenderOptions = countries?.filter((country) => String(country.id) !== String(aggressor));

    const updateWar = useUpdateWar(activeMap, selectedWar);

    const updateWarHandler = async (data: WarInput) => {
        await updateWar.mutateAsync(data);
    };

    const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.getValues());

    return (
        <>
            <Form {...form}>
                <form className="flex flex-col gap-4 py-4" onSubmit={form.handleSubmit(updateWarHandler)}>
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
                    <div className="mt-6 flex gap-2">
                        <Button
                            isLoading={form.formState.isSubmitting}
                            className="flex-1 gap-2"
                            disabled={isFormUnchanged}
                        >
                            <Save />
                            Save Changes
                        </Button>
                        <DeleteWarDialog mapId={activeMap} id={selectedWar} />
                    </div>
                </form>
            </Form>
            <AddParticipantsForm />
        </>
    );
};
export default EditWarForm;
