import { z as zod } from "zod";

export const renameMapSchema = zod.object({
    name: zod
        .string()
        .trim()
        .min(1, { message: "Provide a map name" })
        .max(50, { message: "Map name should be less than 50 characters" }),
});

export type RenameMapInput = zod.infer<typeof renameMapSchema>;
