import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateMap } from "@ipc/maps";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import FileUpload from "@ui/FileUpload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Input } from "@ui/Input";
import { useForm } from "react-hook-form";
import { CreateMapInput, createMapSchema } from "src/shared/schemas/maps/createMap";

const CreateMapForm = () => {
    const setActiveMap = useMapStore((state) => state.setActiveMap);
    const createMap = useCreateMap();

    const form = useForm<CreateMapInput>({
        resolver: zodResolver(createMapSchema),
        defaultValues: {
            name: "",
            provinces: undefined,
        },
    });
    const fileRef = form.register("provinces");

    const createMapHandler = async (data: CreateMapInput) => {
        const newMap = await createMap.mutateAsync(data);
        if (newMap) {
            setActiveMap(newMap.id);
            form.reset();
        }
    };

    return (
        <Form {...form}>
            <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(createMapHandler)}>
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
                <FormField
                    control={form.control}
                    name="provinces"
                    render={() => (
                        <FormItem className="w-full grow">
                            <FormLabel>Provinces Map Image</FormLabel>
                            <FormControl>
                                <FileUpload
                                    {...fileRef}
                                    className="aspect-video"
                                    accept="image/png, image/jpg, image/jpeg, image/webp, image/bmp"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button isLoading={form.formState.isSubmitting}>Create Map</Button>
            </form>
        </Form>
    );
};
export default CreateMapForm;
