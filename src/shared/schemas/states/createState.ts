import { z as zod } from "zod";
import { provincesSchema } from "./provinces.js";
import { stateNameSchema } from "./state.js";

export const createStateSchema = stateNameSchema.merge(provincesSchema.partial());

export type CreateStateInput = zod.infer<typeof createStateSchema>;
