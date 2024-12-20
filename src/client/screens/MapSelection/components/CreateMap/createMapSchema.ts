import { imageSchema, nameSchema } from "@utils/sharedSchemas";
import { z as zod } from "zod";

export const createMapSchema = zod
    .object({
        provinces: imageSchema,
    })
    .merge(nameSchema);

export type CreateMapInput = zod.infer<typeof createMapSchema>;
