import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useAssignHeadOfState, useGetHeadOfState } from "@ipc/government";
import { useGetPoliticians } from "@ipc/politicians";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { formatLocalDate } from "@utils/utils";
import { Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { AssignHeadInput, assignHeadSchema } from "src/shared/schemas/politics/assignHead";

const HeadOfStateForm = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const { data: headOfState } = useGetHeadOfState(activeMap, selectedCountry);

    const defaultValues = useMemo(
        () => ({
            head: headOfState?.id,
            title: headOfState?.title,
            startDate: (formatLocalDate(headOfState?.startDate) as unknown as Date | null) ?? undefined,
            endDate: (formatLocalDate(headOfState?.endDate) as unknown as Date | null) ?? undefined,
        }),
        [headOfState?.endDate, headOfState?.id, headOfState?.startDate, headOfState?.title]
    );

    const form = useForm<AssignHeadInput>({
        resolver: zodResolver(assignHeadSchema),
        defaultValues,
    });

    const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.getValues());

    useEffect(() => {
        form.reset(defaultValues);
    }, [form, defaultValues]);

    const { data: politicians } = useGetPoliticians(activeMap, selectedCountry);

    const assignHeadOfState = useAssignHeadOfState(activeMap, selectedCountry);

    const assignHeadOfStateHandler = async (data: AssignHeadInput) => {
        await assignHeadOfState.mutateAsync(data);
    };

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">Head of State</h3>
            <Form {...form}>
                <form className="flex flex-col gap-4 py-4" onSubmit={form.handleSubmit(assignHeadOfStateHandler)}>
                    <FormField
                        control={form.control}
                        name="head"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leader</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={String(field.value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Leader" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {politicians?.map((politician) => (
                                                <SelectItem key={politician.id} value={String(politician.id)}>
                                                    <div className="flex flex-row items-center gap-2">
                                                        {politician.portrait ? (
                                                            <img
                                                                src={politician.portrait}
                                                                alt={`${politician.name} portrait`}
                                                                className="aspect-[3_/_4] h-7 rounded-sm"
                                                            />
                                                        ) : (
                                                            <div className="flex aspect-[3_/_4] h-7 select-none items-center justify-center rounded-sm bg-muted text-3xl font-medium text-muted-foreground">
                                                                ?
                                                            </div>
                                                        )}
                                                        {politician.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter title name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Since</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        value={
                                            field.value instanceof Date
                                                ? field.value.toISOString().split("T")[0]
                                                : field.value
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel optional>Until</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        value={
                                            field.value instanceof Date
                                                ? field.value.toISOString().split("T")[0]
                                                : field.value
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button isLoading={form.formState.isSubmitting} disabled={isFormUnchanged} className="flex-1 gap-2">
                        <Save />
                        Save Changes
                    </Button>
                </form>
            </Form>
        </div>
    );
};
export default HeadOfStateForm;
