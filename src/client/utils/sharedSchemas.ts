import { z as zod } from "zod";

const MAX_FILE_SIZE = 500000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"];

export const imageSchema = zod
    .unknown()
    .transform((value) => value as File[])
    .superRefine((files, ctx) => {
        if (files.length !== 1) {
            ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                message: "Provide an image",
                fatal: true,
            });

            return zod.NEVER;
        }
        return true;
    })
    .refine((files) => files[0].size <= MAX_FILE_SIZE, "Max image size is 500MB")
    .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files[0].type),
        "Provide an image in .jpg, .jpeg, .png or .webp format"
    )
    .transform((files) => files[0])
    .transform((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    });

export const audioSchema = zod
    .unknown()
    .transform((value) => value as File[])
    .superRefine((files, ctx) => {
        if (files.length !== 1) {
            ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                message: "Provide an audio",
                fatal: true,
            });

            return zod.NEVER;
        }
        return true;
    })
    .refine((files) => files[0].size <= MAX_FILE_SIZE, "Max audio size is 500MB")
    .refine((files) => files[0].type.includes("audio"), "Provide an audio file")
    .transform((files) => files[0])
    .transform((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    });

export const nameSchema = zod.object({
    name: zod
        .string()
        .trim()
        .min(1, { message: "Provide a name" })
        .max(50, { message: "The name should be less than 50 characters" }),
});

export type NameInput = zod.infer<typeof nameSchema>;
