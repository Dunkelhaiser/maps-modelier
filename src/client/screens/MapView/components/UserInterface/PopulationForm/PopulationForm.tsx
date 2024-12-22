import { zodResolver } from "@hookform/resolvers/zod";
import { useAddPopulation } from "@ipc/province";
import { useAppStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Label } from "@ui/Label";
import { X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import EthnicitiesSelect from "./EthnicitiesSelect";
import { PopulationInput, populationSchema } from "./populationSchema";

const PopulationForm = () => {
    const activeMap = useAppStore((state) => state.activeMap)!;
    const selectedProvinces = useAppStore((state) => state.selectedProvinces);
    const addPopulation = useAddPopulation(activeMap.id, selectedProvinces[0].id);

    const form = useForm<PopulationInput>({
        resolver: zodResolver(populationSchema),
        defaultValues: {
            populations: [],
        },
    });

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
                    {populationsField.map((populationField, index) => {
                        return (
                            <div className="flex gap-2" key={populationField.id}>
                                <FormField
                                    control={form.control}
                                    name={`populations.${index}.ethnicityId`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <EthnicitiesSelect onChange={field.onChange} value={field.value} />
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
                                <Button variant="ghost" aria-label="Remove" size="icon" onClick={() => remove(index)}>
                                    <X />
                                </Button>
                            </div>
                        );
                    })}

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            onClick={() => append({ ethnicityId: 0, population: 0 })}
                            disabled={populationsField.length >= 10}
                        >
                            Add Ethnicity
                        </Button>
                        <Button isLoading={form.formState.isSubmitting}>Save</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
export default PopulationForm;
