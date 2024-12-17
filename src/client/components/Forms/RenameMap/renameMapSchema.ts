import { z as zod } from "zod";

export const renameMapSchema = zod.object({
    name: zod.string().trim().min(1).max(50),
});

export type RenameMapInput = zod.infer<typeof renameMapSchema>;
