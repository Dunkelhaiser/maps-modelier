import { z as zod } from "zod";
import { imageSchema, nameSchema } from "../shared";

export const createMapSchema = zod
    .object({
        provinces: imageSchema(),
    })
    .merge(nameSchema);

export type CreateMapInput = zod.infer<typeof createMapSchema>;
