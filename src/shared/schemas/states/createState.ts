import { z as zod } from "zod";
import { stateNameSchema } from "./state.js";

export const createStateSchema = zod
    .object({
        provinces: zod.array(zod.number()).optional(),
    })
    .merge(stateNameSchema);

export type CreateStateInput = zod.infer<typeof createStateSchema>;
