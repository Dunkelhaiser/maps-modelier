import { z as zod } from "zod";

const MAX_FILE_SIZE = 500000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"];

interface FileOptions {
    maxSize?: number;
    acceptedTypes: string[];
    emptyMessage?: string;
    sizeMessage?: string;
    typesMessage?: string;
}

const isFileTypeMatch = (fileType: string, acceptedType: string) => {
    if (acceptedType.endsWith("/*")) {
        const [mainType] = acceptedType.split("/");
        return fileType.startsWith(`${mainType}/`);
    }

    return fileType === acceptedType;
};

export const fileSchema = ({
    maxSize = MAX_FILE_SIZE,
    acceptedTypes,
    emptyMessage = "Provide a file",
    sizeMessage = `Max size is ${maxSize}MB`,
    typesMessage = "Provide a file in the accepted format",
}: FileOptions) =>
    zod
        .unknown()
        .transform((value) => value as File[])
        .superRefine((files, ctx) => {
            if (files.length !== 1) {
                ctx.addIssue({
                    code: zod.ZodIssueCode.custom,
                    message: emptyMessage,
                    fatal: true,
                });

                return zod.NEVER;
            }
            return true;
        })
        .refine((files) => files[0].size <= MAX_FILE_SIZE, sizeMessage)
        .refine((files) => acceptedTypes.some((type) => isFileTypeMatch(files[0].type, type)), typesMessage)
        .transform((files) => files[0])
        .transform((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
            });
        });

export const imageSchema = fileSchema({
    acceptedTypes: ACCEPTED_IMAGE_TYPES,
    typesMessage: "Provide an image in .jpg, .jpeg, .png, .webp or .bmp format",
    sizeMessage: "Max image size is 500MB",
    emptyMessage: "Provide an image",
});

export const audioSchema = fileSchema({
    acceptedTypes: ["audio/*"],
    typesMessage: "Provide an audio file",
    sizeMessage: "Max audio size is 500MB",
    emptyMessage: "Provide an audio",
});

export const nameSchema = zod.object({
    name: zod
        .string()
        .trim()
        .min(1, { message: "Provide a name" })
        .max(50, { message: "The name should be less than 50 characters" }),
});

export type NameInput = zod.infer<typeof nameSchema>;
