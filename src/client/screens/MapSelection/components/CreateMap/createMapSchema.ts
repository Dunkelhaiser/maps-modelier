import { imageSchema } from "@utils/sharedSchemas";
import { z as zod } from "zod";

export const createMapSchema = zod.object({
    name: zod
        .string()
        .trim()
        .min(1, { message: "Provide map name" })
        .max(50, { message: "Map name should be less than 50 characters" }),
    provinces: imageSchema,
});

export type CreateMapInput = zod.infer<typeof createMapSchema>;
