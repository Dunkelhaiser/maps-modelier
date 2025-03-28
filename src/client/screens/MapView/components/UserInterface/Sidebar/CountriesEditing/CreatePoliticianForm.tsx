import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveMap } from "@hooks/useActiveMap";
import { useCreatePolitician } from "@ipc/politicians";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { Card, CardContent } from "@ui/Card";
import FileUpload from "@ui/FileUpload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { PoliticianInput, politicianSchema } from "src/shared/schemas/politics/politician";

interface Props {
    stopCreating: () => void;
}

const CreatePoliticianForm = ({ stopCreating }: Props) => {
    const form = useForm<PoliticianInput>({
        resolver: zodResolver(politicianSchema),
        defaultValues: {
            name: "",
            portrait: "",
        },
    });
    const portraitRef = form.register("portrait");

    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const createIdeology = useCreatePolitician(activeMap, selectedCountry);

    const createPoliticianHandler = async (data: PoliticianInput) => {
        await createIdeology.mutateAsync(data);
        stopCreating();
    };

    return (
        <Card>
            <Form {...form}>
                <form id="createForm" onSubmit={form.handleSubmit(createPoliticianHandler)}>
                    <FormField
                        control={form.control}
                        name="portrait"
                        render={() => (
                            <FormItem>
                                <FormControl>
                                    <FileUpload
                                        className="aspect-[3_/_4] w-full"
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
                            <Button className="flex-1" isLoading={form.formState.isSubmitting}>
                                <Save className="size-4" /> Save
                            </Button>
                            <Button type="button" aria-label="Cancel" onClick={stopCreating} variant="ghost">
                                <X className="size-4" />
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Form>
        </Card>
    );
};
export default CreatePoliticianForm;
