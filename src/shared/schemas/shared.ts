/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from "fs/promises";
import path from "path";
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

function isBrowserEnvironment(): boolean {
    return (
        typeof globalThis !== "undefined" &&
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        typeof globalThis.window !== "undefined" &&
        // @ts-ignore
        typeof globalThis.window.document !== "undefined"
    );
}

const getMimeType = (filePath: string): string => {
    const extension = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        bmp: "image/bmp",
        gif: "image/gif",
        webp: "image/webp",
        svg: "image/svg+xml",
        mp3: "audio/mpeg",
        mpeg: "audio/mpeg",
        wav: "audio/wav",
        ogg: "audio/ogg",
    };

    return mimeTypes[extension] || "application/octet-stream";
};

export const fileSchema = <TOptional extends boolean = false>({
    maxSize = MAX_FILE_SIZE,
    acceptedTypes,
    emptyMessage = "Provide a file",
    sizeMessage = `Max size is ${maxSize}MB`,
    typesMessage = "Provide a file in the accepted format",
    optional = false as TOptional,
}: FileOptions & { optional?: TOptional }) => {
    if (isBrowserEnvironment()) {
        return zod
            .custom<File[]>()
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
                return files[0].size <= maxSize;
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
                // @ts-ignore
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
    }

    const baseSchema = optional ? zod.string().optional() : zod.string();
    return baseSchema
        .refine((value) => {
            if (optional && (value === undefined || value === "")) return true;
            if (!value) return false;

            return (
                value.startsWith("data:") ||
                fs
                    .access(value)
                    .then(() => true)
                    .catch(() => false)
            );
        })
        .transform(async (value) => {
            if (optional && (value === undefined || value === "")) {
                return undefined as TOptional extends true ? string | undefined : string;
            }

            if (!value) {
                throw new Error("File value is required");
            }

            if (value.startsWith("data:")) {
                return value as TOptional extends true ? string | undefined : string;
            }

            const mimeType = getMimeType(value);
            try {
                const data = await fs.readFile(value, { encoding: "base64" });
                return `data:${mimeType};base64,${data}` as TOptional extends true ? string | undefined : string;
            } catch (error) {
                throw new Error(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
};

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

const getArticle = (word: string) => {
    if (!word) return "a";

    return /^[aeiou]/i.test(word.toLowerCase()) ? "an" : "a";
};

export const nameField = ({ field = "", min = 1, max = 50 }) =>
    zod
        .string()
        .trim()
        .min(min, { message: `Provide ${getArticle(field)} ${field} name` })
        .max(max, { message: `The ${field} name should be less than ${max} characters` });
