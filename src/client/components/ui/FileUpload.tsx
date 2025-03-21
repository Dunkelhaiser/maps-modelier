import { Input, InputProps } from "@ui/Input";
import { cn } from "@utils/utils";
import { CloudUpload } from "lucide-react";
import { forwardRef, useState, useEffect } from "react";

const FileUpload = forwardRef<
    HTMLInputElement,
    InputProps & { defaultImg?: string; object?: "cover" | "contain" | "fill" | "none" | "scale-down" }
>(({ defaultImg, object, ...props }, ref) => {
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (defaultImg) setImage(defaultImg);
        else setImage(null);
    }, [defaultImg, ref]);

    return (
        <label
            htmlFor={props.id}
            className={cn(
                "relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-border bg-background transition focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 focus-within:ring-offset-background hover:bg-muted disabled:pointer-events-none disabled:opacity-50 dark:border-muted-foreground/25",
                props.className
            )}
        >
            <div className="flex flex-col items-center justify-center text-balance py-5 text-center">
                <CloudUpload size={32} className="mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, JPEG, BMP or WEBP</p>
            </div>
            <Input
                {...props}
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/webp, image/bmp"
                className="absolute inset-0 h-full opacity-0 hover:cursor-pointer"
                style={{ objectFit: object ?? "cover" }}
                ref={ref}
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        const reader = new FileReader();
                        reader.onload = () => setImage(reader.result as string);
                        reader.readAsDataURL(e.target.files[0]);
                    } else setImage(null);
                    props.onChange?.(e);
                }}
            />
            {(image ?? (defaultImg && typeof defaultImg === "string")) && (
                <img
                    src={image ?? defaultImg}
                    alt="Preview"
                    className="absolute inset-0 size-full bg-white"
                    style={{ objectFit: object ?? "cover" }}
                />
            )}
        </label>
    );
});
FileUpload.displayName = "File Upload";

export default FileUpload;
