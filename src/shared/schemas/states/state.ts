import { z as zod } from "zod";
import { nameField } from "../shared.js";

export const stateSchema = zod.object({
    name: nameField({ field: "state", min: 1, max: 50 }),
});

export type StateInput = zod.infer<typeof stateSchema>;
