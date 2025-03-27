import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateIdeology } from "@ipc/ideologies";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { TableCell, TableRow } from "@ui/Table";
import { Check, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IdeologyInput, ideologySchema } from "src/shared/schemas/ideologies/ideology";

interface Props {
    mapId: string;
}

const IdeologyRowCreate = ({ mapId }: Props) => {
    const [isCreating, setIsCreating] = useState(false);

    return !isCreating ? (
        <TableRow className="hover:bg-card">
            <TableCell className="" />
            <TableCell className="w-[9.25rem] font-medium" />
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
        <IdeologyRowCreating mapId={mapId} stopCreating={() => setIsCreating(false)} />
    );
};
export default IdeologyRowCreate;

interface PropsCreating {
    mapId: string;
    stopCreating: () => void;
}

const IdeologyRowCreating = ({ mapId, stopCreating }: PropsCreating) => {
    const createIdeology = useCreateIdeology(mapId);

    const form = useForm<IdeologyInput>({
        resolver: zodResolver(ideologySchema),
        defaultValues: {
            name: "",
            color: "#808080",
        },
    });

    const colorPickerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        form.setFocus("name");
    }, [form]);

    const createIdeologyHandler = async (data: IdeologyInput) => {
        await createIdeology.mutateAsync(data);
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
                        onSubmit={form.handleSubmit(createIdeologyHandler)}
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
                                            aria-label="Ideology name"
                                            placeholder="Enter ideology name"
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
