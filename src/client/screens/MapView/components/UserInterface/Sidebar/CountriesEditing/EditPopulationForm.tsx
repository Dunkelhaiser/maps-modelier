import InfoBlock from "@components/InfoBlock";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useAddOffmapPopulation, useGetPopulation } from "@ipc/countries";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Label } from "@ui/Label";
import { ScrollArea } from "@ui/ScrollArea";
import { Plus, Save, Users, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { PopulationFormInput, populationFormSchema } from "src/shared/schemas/provinces/population";
import { Ethnicity } from "src/shared/types";
import EthnicitiesSelect from "../../PopulationForm/EthnicitiesSelect";
import { EthnicityBar } from "../Country/EthnicityBar";

const EditPopulationForm = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const addPopulation = useAddOffmapPopulation(activeMap, selectedCountry);
    const { data: population } = useGetPopulation(activeMap, selectedCountry);

    const defaultValues = useMemo(
        () => ({
            populations:
                population?.offMapPopulation.map((p) => ({
                    ethnicityId: p.id,
                    population: p.population,
                })) ?? [],
        }),
        [population?.offMapPopulation]
    );

    const form = useForm<PopulationFormInput>({
        resolver: zodResolver(populationFormSchema),
        defaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues, form]);

    const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.getValues());

    const {
        fields: populationsField,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "populations",
    });

    const addPopulationHandler = async (data: PopulationFormInput) => {
        await addPopulation.mutateAsync(data.populations);
    };

    const selectedEthnicities = form.watch("populations").map((p) => Number(p.ethnicityId));

    const mergedEthnicities = useMemo(() => {
        if (!population) return [];

        const ethnicityMap = new Map<number, Ethnicity>();

        population.offMapPopulation.forEach((ethnicity) => {
            ethnicityMap.set(ethnicity.id, { ...ethnicity });
        });

        population.onMapPopulation.forEach((ethnicity) => {
            if (ethnicityMap.has(ethnicity.id)) {
                const existing = ethnicityMap.get(ethnicity.id);

                if (!existing) return;

                ethnicityMap.set(ethnicity.id, {
                    ...existing,
                    population: existing.population + ethnicity.population,
                });
            } else {
                ethnicityMap.set(ethnicity.id, { ...ethnicity });
            }
        });

        return Array.from(ethnicityMap.values());
    }, [population]);

    const totalPopulation = useMemo(
        () => mergedEthnicities.reduce((acc, ethnicity) => acc + ethnicity.population, 0),
        [mergedEthnicities]
    );

    return (
        <>
            <div className="space-y-4">
                <InfoBlock Icon={Users} label="Population" value={totalPopulation.toLocaleString()} />
                <EthnicityBar ethnicities={mergedEthnicities} />
            </div>
            <Form {...form}>
                <form className="grid gap-4 pt-4" onSubmit={form.handleSubmit(addPopulationHandler)}>
                    <Label>Offmap Population</Label>
                    <ScrollArea viewportClassName="max-h-[50vh]">
                        <div className="space-y-4 py-1 pr-4">
                            {populationsField.map((populationField, index) => {
                                const otherSelectedEthnicities = selectedEthnicities.filter(
                                    (_, i) => i !== index && selectedEthnicities[i] !== 0
                                );

                                return (
                                    <div className="flex gap-2" key={populationField.id}>
                                        <FormField
                                            control={form.control}
                                            name={`populations.${index}.ethnicityId`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <EthnicitiesSelect
                                                            onChange={field.onChange}
                                                            value={field.value}
                                                            selectedEthnicities={otherSelectedEthnicities}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`populations.${index}.population`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input {...field} type="number" className="h-9 max-w-24" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            variant="ghost"
                                            aria-label="Remove"
                                            size="icon"
                                            onClick={() => remove(index)}
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>

                    <div className="flex gap-2">
                        <Button
                            className="flex-1 gap-2"
                            type="button"
                            onClick={() => append({ ethnicityId: 0, population: 0 })}
                        >
                            <Plus />
                            Add Ethnicity
                        </Button>
                        <Button
                            className="flex-1 gap-2"
                            isLoading={form.formState.isSubmitting}
                            disabled={isFormUnchanged}
                        >
                            <Save />
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};
export default EditPopulationForm;
