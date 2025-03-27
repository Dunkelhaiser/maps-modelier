import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateIdeology } from "@ipc/ideologies";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { TableCell, TableRow } from "@ui/Table";
import { Check, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { IdeologyInput, ideologySchema } from "src/shared/schemas/ideologies/ideology";
import { Ideology } from "src/shared/types";

interface Props {
    mapId: string;
    ideology: Ideology;
    stopEditing: () => void;
}

const IdeologyRowEdit = ({ mapId, ideology, stopEditing }: Props) => {
    const editIdeology = useUpdateIdeology(mapId, ideology.id);

    const form = useForm<IdeologyInput>({
        resolver: zodResolver(ideologySchema),
        defaultValues: {
            name: ideology.name,
            color: ideology.color,
        },
    });

    const colorPickerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        form.setFocus("name");
    }, [form]);

    const editIdeologyHandler = async (data: IdeologyInput) => {
        if (data.name === ideology.name && data.color === ideology.color) {
            stopEditing();
            return;
        }

        await editIdeology.mutateAsync(data);
        stopEditing();
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
                    <form id="renameForm" className="max-w-[8.5rem]" onSubmit={form.handleSubmit(editIdeologyHandler)}>
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
                                            aria-label="Ideology name"
                                            placeholder="Enter ideology name"
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
export default IdeologyRowEdit;
