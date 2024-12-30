import { zodResolver } from "@hookform/resolvers/zod";
import { useMapSotre } from "@store/store";
import { Button } from "@ui/Button";
import FileUpload from "@ui/FileUpload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/Form";
import { Map } from "@utils/types";
import { useForm } from "react-hook-form";
import { UploadeMapImageInput, uploadMapImageSchema } from "./uploadMapImageSchema";

interface Props {
    selectedMapForUpload: Map | null;
}

const UploadMapImageForm = ({ selectedMapForUpload }: Props) => {
    const setActiveMap = useMapSotre((state) => state.setActiveMap);

    const form = useForm<UploadeMapImageInput>({
        resolver: zodResolver(uploadMapImageSchema),
        defaultValues: {
            provinces: undefined,
        },
    });
    const fileRef = form.register("provinces");

    const handleExistingMapImageUpload = async (data: UploadeMapImageInput) => {
        if (!selectedMapForUpload) return;
        await window.electronAPI.saveMapImage(data.provinces, selectedMapForUpload.id);
        setActiveMap({ ...selectedMapForUpload, imageUrl: data.provinces });
    };

    return (
        <Form {...form}>
            <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(handleExistingMapImageUpload)}>
                <FormField
                    control={form.control}
                    name="provinces"
                    render={() => (
                        <FormItem className="w-full grow">
                            <FormLabel>Provinces Map Image</FormLabel>
                            <FormControl>
                                <FileUpload
                                    {...fileRef}
                                    accept="image/png, image/jpg, image/jpeg, image/webp, image/bmp"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button isLoading={form.formState.isSubmitting}>Upload Map</Button>
            </form>
        </Form>
    );
};
export default UploadMapImageForm;
