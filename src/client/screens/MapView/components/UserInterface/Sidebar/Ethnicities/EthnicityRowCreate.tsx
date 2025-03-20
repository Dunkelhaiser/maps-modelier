import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEthnicity } from "@ipc/ethnicities";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { TableCell, TableRow } from "@ui/Table";
import { Check, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EthnicityInput, ethnicitySchema } from "src/shared/schemas/ethnicities/ethnicity";

interface Props {
    mapId: string;
}

const EthnicityRowCreate = ({ mapId }: Props) => {
    const [isCreating, setIsCreating] = useState(false);

    return !isCreating ? (
        <TableRow className="hover:bg-card">
            <TableCell className="" />
            <TableCell className="w-[9.25rem] font-medium" />
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

    const form = useForm<EthnicityInput>({
        resolver: zodResolver(ethnicitySchema),
        defaultValues: {
            name: "",
            color: "#39654a",
        },
    });

    const colorPickerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        form.setFocus("name");
    }, [form]);

    const createEthnicityHandler = async (data: EthnicityInput) => {
        await createEthnicity.mutateAsync(data);
        stopCreating();
    };

    return (
        <TableRow>
            <TableCell>
                <button
                    type="button"
                    style={{
                        backgroundColor: form.watch("color"),
                        width: "1.25rem",
                        height: "1.25rem",
                        borderRadius: "50%",
                        display: "block",
                    }}
                    onClick={() => colorPickerRef.current?.click()}
                />
            </TableCell>
            <TableCell className="w-[9.25rem] font-medium">
                <Form {...form}>
                    <form
                        id="createForm"
                        className="max-w-[8.5rem]"
                        onSubmit={form.handleSubmit(createEthnicityHandler)}
                    >
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem className="invisible size-0">
                                    <FormControl>
                                        <Input type="color" {...field} ref={colorPickerRef} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
