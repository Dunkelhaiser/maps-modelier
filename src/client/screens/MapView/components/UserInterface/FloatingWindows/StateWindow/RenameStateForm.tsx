import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useDeleteState, useGetStateById, useRenameState } from "@ipc/states";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Save, Trash } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { StateNameInput, stateNameSchema } from "src/shared/schemas/states/state";

const RenameStateForm = () => {
    const activeMap = useActiveMap();
    const selectedState = useMapStore((state) => state.selectedState)!;
    const { data: state } = useGetStateById(activeMap, selectedState);

    const defaultValues = useMemo(
        () => ({
            name: state?.name,
        }),
        [state?.name]
    );

    const form = useForm<StateNameInput>({
        resolver: zodResolver(stateNameSchema),
        defaultValues,
    });

    const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.getValues());

    useEffect(() => {
        form.reset({ name: state?.name });
    }, [form, state?.name]);

    const renameState = useRenameState(activeMap, selectedState);
    const deleteState = useDeleteState(activeMap, selectedState);

    const renameStateHanlder = (data: StateNameInput) => {
        renameState.mutateAsync(data);
    };

    return (
        <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(renameStateHanlder)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter state name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-row justify-between gap-4">
                    <Button isLoading={form.formState.isSubmitting} className="flex-1 gap-2" disabled={isFormUnchanged}>
                        <Save />
                        Rename State
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        aria-label="Delete State"
                        onClick={() => deleteState.mutate()}
                    >
                        <Trash />
                    </Button>
                </div>
            </form>
        </Form>
    );
};
export default RenameStateForm;
