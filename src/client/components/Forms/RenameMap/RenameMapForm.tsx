import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Map } from "@utils/types";
import { useForm } from "react-hook-form";
import { RenameMapInput, renameMapSchema } from "./renameMapSchema";
import { useRenameMap } from "@/ipc/maps";

interface Props {
    map: Map;
    closeDialog: () => void;
}

const RenameMapForm = ({ map, closeDialog }: Props) => {
    const renameMap = useRenameMap(map.id);

    const form = useForm<RenameMapInput>({
        resolver: zodResolver(renameMapSchema),
        defaultValues: {
            name: map.name,
        },
    });

    const renameMapHandler = async (data: RenameMapInput) => {
        await renameMap.mutateAsync(data.name);
        closeDialog();
    };

    return (
        <Form {...form}>
            <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(renameMapHandler)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Map Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter map name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button isLoading={form.formState.isSubmitting}>Rename Map</Button>
            </form>
        </Form>
    );
};
export default RenameMapForm;
