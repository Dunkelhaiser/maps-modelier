import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEthnicity } from "@ipc/ethnicities";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { TableCell, TableRow } from "@ui/Table";
import { NameInput, nameSchema } from "@utils/sharedSchemas";
import { Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
    mapId: string;
}

const EthnicityRowCreate = ({ mapId }: Props) => {
    const [isCreating, setIsCreating] = useState(false);

    return !isCreating ? (
        <TableRow className="hover:bg-card">
            <TableCell className="font-medium" />
            <TableCell className="text-right" />
            <TableCell className="text-right">
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-6"
                    aria-label="Add"
                    type="button"
                    onClick={() => setIsCreating(true)}
                >
                    <Plus className="!size-3.5" />
                </Button>
            </TableCell>
        </TableRow>
    ) : (
        <EthnicityRowCreating mapId={mapId} stopCreating={() => setIsCreating(false)} />
    );
};
export default EthnicityRowCreate;

interface PropsCreating {
    mapId: string;
    stopCreating: () => void;
}

const EthnicityRowCreating = ({ mapId, stopCreating }: PropsCreating) => {
    const createEthnicity = useCreateEthnicity(mapId);

    const form = useForm<NameInput>({
        resolver: zodResolver(nameSchema),
        defaultValues: {
            name: "",
        },
    });

    const createEthnicityHandler = async (data: NameInput) => {
        await createEthnicity.mutateAsync(data.name);
        stopCreating();
    };

    return (
        <TableRow>
            <TableCell className="w-[105.91px] font-medium">
                <Form {...form}>
                    <form id="createForm" className="grid gap-4" onSubmit={form.handleSubmit(createEthnicityHandler)}>
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
                                            className="ring-1 ring-ring"
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
            <TableCell className="text-right" />
            <TableCell className="space-x-1 text-right">
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-6"
                    aria-label="Create"
                    disabled={form.formState.isSubmitting}
                    form="createForm"
                >
                    <Check className="!size-3.5" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-6"
                    aria-label="Cancel"
                    onClick={stopCreating}
                    type="button"
                >
                    <X className="!size-3.5" />
                </Button>
            </TableCell>
        </TableRow>
    );
};
