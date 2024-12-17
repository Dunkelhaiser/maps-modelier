import { z as zod } from "zod";
import { imageSchema } from "../sharedSchemas";

export const createMapSchema = zod.object({
    name: zod.string().trim().min(1).max(50),
    provinces: imageSchema,
});

export type CreateMapInput = zod.infer<typeof createMapSchema>;
