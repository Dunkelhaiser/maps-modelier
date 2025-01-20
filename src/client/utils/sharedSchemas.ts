import { z as zod } from "zod";

const MAX_FILE_SIZE = 500000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"];

interface FileOptions {
    maxSize?: number;
    acceptedTypes: string[];
    emptyMessage?: string;
    sizeMessage?: string;
    typesMessage?: string;
    optional?: boolean;
}

const isFileTypeMatch = (fileType: string, acceptedType: string) => {
    if (acceptedType.endsWith("/*")) {
        const [mainType] = acceptedType.split("/");
        return fileType.startsWith(`${mainType}/`);
    }

    return fileType === acceptedType;
};

export const fileSchema = <TOptional extends boolean = false>({
    maxSize = MAX_FILE_SIZE,
    acceptedTypes,
    emptyMessage = "Provide a file",
    sizeMessage = `Max size is ${maxSize}MB`,
    typesMessage = "Provide a file in the accepted format",
    optional = false as TOptional,
}: FileOptions & { optional?: TOptional }) =>
    zod
        .unknown()
        .transform((value) => value as File[])
        .superRefine((files, ctx) => {
            if (optional && files.length === 0) return undefined;

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
        .refine((files) => {
            if (optional && files.length === 0) return true;
            return files[0].size <= MAX_FILE_SIZE;
        }, sizeMessage)
        .refine((files) => {
            if (optional && files.length === 0) return true;
            return acceptedTypes.some((type) => isFileTypeMatch(files[0].type, type));
        }, typesMessage)
        .transform((files) => {
            if (optional && files.length === 0) {
                return Promise.resolve(undefined as TOptional extends true ? string | undefined : string);
            }
            const [file] = files;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise<TOptional extends true ? string | undefined : string>((resolve, reject) => {
                reader.onload = () => {
                    if (reader.result === null) {
                        reject(new Error("Failed to read file"));
                        return;
                    }
                    resolve(reader.result as TOptional extends true ? string | undefined : string);
                };
                reader.onerror = reject;
            });
        });

export const imageSchema = <TOptional extends boolean = false>(
    { optional = false as TOptional } = {} as { optional?: TOptional }
) =>
    fileSchema({
        acceptedTypes: ACCEPTED_IMAGE_TYPES,
        typesMessage: "Provide an image in .jpg, .jpeg, .png, .webp or .bmp format",
        sizeMessage: "Max image size is 500MB",
        emptyMessage: "Provide an image",
        optional,
    });

export const audioSchema = <TOptional extends boolean = false>(
    { optional = false as TOptional } = {} as { optional?: TOptional }
) =>
    fileSchema({
        acceptedTypes: ["audio/*"],
        typesMessage: "Provide an audio file",
        sizeMessage: "Max audio size is 500MB",
        emptyMessage: "Provide an audio",
        optional,
    });

export const nameSchema = zod.object({
    name: zod
        .string()
        .trim()
        .min(1, { message: "Provide a name" })
        .max(50, { message: "The name should be less than 50 characters" }),
});

export type NameInput = zod.infer<typeof nameSchema>;
