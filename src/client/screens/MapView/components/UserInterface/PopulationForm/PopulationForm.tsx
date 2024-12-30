import { zodResolver } from "@hookform/resolvers/zod";
import { useAddPopulation } from "@ipc/provinces";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Label } from "@ui/Label";
import { ScrollArea } from "@ui/ScrollArea";
import { EthnicityPopulation } from "@utils/types";
import { X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import EthnicitiesSelect from "./EthnicitiesSelect";
import { PopulationInput, populationSchema } from "./populationSchema";

interface Props {
    ethnicities?: EthnicityPopulation[];
}

const PopulationForm = ({ ethnicities }: Props) => {
    const activeMap = useMapStore((state) => state.activeMap)!;
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const addPopulation = useAddPopulation(activeMap.id, selectedProvinces[0].id);

    const defaultValues = useMemo(
        () => ({
            populations: ethnicities ?? [],
        }),
        [ethnicities]
    );

    const form = useForm<PopulationInput>({
        resolver: zodResolver(populationSchema),
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

    const addPopulationHandler = async (data: PopulationInput) => {
        await addPopulation.mutateAsync(data.populations);
    };

    return (
        <div>
            <Form {...form}>
                <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(addPopulationHandler)}>
                    <Label>Population</Label>
                    <ScrollArea viewportClassName="max-h-[50vh]">
                        <div className="space-y-4 py-1 pr-4">
                            {populationsField.map((populationField, index) => {
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
                            type="button"
                            onClick={() => append({ ethnicityId: 0, population: 0 })}
                            disabled={populationsField.length >= 10}
                        >
                            Add Ethnicity
                        </Button>
                        <Button isLoading={form.formState.isSubmitting} disabled={isFormUnchanged}>
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
export default PopulationForm;
