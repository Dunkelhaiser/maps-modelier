import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useDeleteState, useRenameState } from "@ipc/states";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { NameInput, nameSchema } from "@utils/sharedSchemas";
import { Trash } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const RenameStateForm = () => {
    const selectedState = useMapStore((state) => state.selectedState)!;
    const form = useForm<NameInput>({
        resolver: zodResolver(nameSchema),
        defaultValues: {
            name: selectedState.name,
        },
    });

    useEffect(() => {
        form.reset({ name: selectedState.name });
    }, [form, selectedState.name]);

    const activeMap = useActiveMap();
    const renameState = useRenameState(activeMap.id, selectedState.id);
    const deleteState = useDeleteState(activeMap.id, selectedState.id);

    const renameStateHanlder = (data: NameInput) => {
        renameState.mutateAsync(data.name);
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
                    <Button isLoading={form.formState.isSubmitting}>Rename State</Button>
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
