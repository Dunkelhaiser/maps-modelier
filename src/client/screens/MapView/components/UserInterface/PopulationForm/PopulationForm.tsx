import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useAddPopulation } from "@ipc/provinces";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Label } from "@ui/Label";
import { ScrollArea } from "@ui/ScrollArea";
import { X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { PopulationFormInput, populationFormSchema } from "src/shared/schemas/provinces/population";
import { EthnicityPopulation } from "src/shared/types";
import EthnicitiesSelect from "./EthnicitiesSelect";

interface Props {
    ethnicities?: EthnicityPopulation[];
}

const PopulationForm = ({ ethnicities }: Props) => {
    const activeMap = useActiveMap();
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const addPopulation = useAddPopulation(activeMap.id, selectedProvinces[0].id);

    const defaultValues = useMemo(
        () => ({
            populations: ethnicities ?? [],
        }),
        [ethnicities]
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

    return (
        <div>
            <Form {...form}>
                <form className="grid gap-4 pt-4" onSubmit={form.handleSubmit(addPopulationHandler)}>
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
