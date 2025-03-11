import { zodResolver } from "@hookform/resolvers/zod";
import { useRenameEthnicity } from "@ipc/ethnicities";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { TableCell, TableRow } from "@ui/Table";
import { Check, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { EthnicityInput, ethnicitySchema } from "src/shared/schemas/ethnicities/ethnicity";
import { Ethnicity } from "src/shared/types";

interface Props {
    mapId: string;
    ethnicity: Ethnicity;
    stopEditing: () => void;
}

const EthnicityRowEdit = ({ mapId, ethnicity, stopEditing }: Props) => {
    const renameEthnicity = useRenameEthnicity(mapId, ethnicity.id);

    const form = useForm<EthnicityInput>({
        resolver: zodResolver(ethnicitySchema),
        defaultValues: {
            name: ethnicity.name,
        },
    });

    useEffect(() => {
        form.setFocus("name");
    }, [form]);

    const renameEthnicityHandler = async (data: EthnicityInput) => {
        if (data.name === ethnicity.name) {
            stopEditing();
            return;
        }

        await renameEthnicity.mutateAsync(data);
        stopEditing();
    };

    return (
        <TableRow>
            <TableCell className="w-[9.25rem] font-medium">
                <Form {...form}>
                    <form
                        id="renameForm"
                        className="grid max-w-[8.5rem] gap-4"
                        onSubmit={form.handleSubmit(renameEthnicityHandler)}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            variant="plain"
                                            aria-label="Ethnicity name"
                                            placeholder="Enter ethnicity name"
                                            className="max-w-[8.5rem]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </TableCell>
            <TableCell className="text-right">{ethnicity.totalNumber?.toLocaleString() ?? 0}</TableCell>
            <TableCell className="space-x-1 text-right">
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-6"
                    aria-label="Apply"
                    disabled={form.formState.isSubmitting}
                    form="renameForm"
                >
                    <Check className="!size-3.5" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-6"
                    aria-label="Cancel"
                    onClick={stopEditing}
                    type="button"
                >
                    <X className="!size-3.5" />
                </Button>
            </TableCell>
        </TableRow>
    );
};
export default EthnicityRowEdit;
