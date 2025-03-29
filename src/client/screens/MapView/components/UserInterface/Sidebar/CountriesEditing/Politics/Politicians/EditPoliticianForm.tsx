import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useUpdatePolitician } from "@ipc/politicians";
import { Button } from "@ui/Button";
import { Card, CardContent } from "@ui/Card";
import FileUpload from "@ui/FileUpload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Save } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { PoliticianInput, politicianSchema } from "src/shared/schemas/politics/politician";
import { Politician } from "src/shared/types";
import DeletePoliticianDialog from "./DeletePoliticianDialog";

interface Props {
    politician: Politician;
}

const EditPoliticianForm = ({ politician }: Props) => {
    const defaultValues = useMemo(
        () => ({
            name: politician.name,
            portrait: "",
        }),
        [politician.name]
    );

    const form = useForm<PoliticianInput>({
        resolver: zodResolver(politicianSchema),
        defaultValues,
    });
    const portraitRef = form.register("portrait");

    const activeMap = useActiveMap();
    const updatePolitician = useUpdatePolitician(activeMap, politician.id);

    const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.getValues());

    const updatePoliticianHandler = async (data: PoliticianInput) => {
        await updatePolitician.mutateAsync(data);
    };

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(updatePoliticianHandler)}>
                    <FormField
                        control={form.control}
                        name="portrait"
                        render={() => (
                            <FormItem>
                                <FormControl>
                                    <FileUpload
                                        className="aspect-[3_/_4] w-full"
                                        defaultImg={politician.portrait ?? ""}
                                        resetKey={politician.id}
                                        {...portraitRef}
                                        accept="image/png, image/jpg, image/jpeg, image/webp, image/bmp"
                                    />
                                </FormControl>
                                <FormMessage className="ml-2" />
                            </FormItem>
                        )}
                    />
                    <CardContent className="space-y-2 p-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2">
                            <Button
                                className="flex-1"
                                isLoading={form.formState.isSubmitting}
                                disabled={isFormUnchanged}
                            >
                                <Save className="size-4" /> Save
                            </Button>
                            <DeletePoliticianDialog mapId={activeMap} id={politician.id} />
                        </div>
                    </CardContent>
                </form>
            </Form>
        </Card>
    );
};
export default EditPoliticianForm;
