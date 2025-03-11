import { z as zod } from "zod";
import { nameField } from "../shared.js";

export const stateNameSchema = zod.object({
    name: nameField({ field: "state", min: 1, max: 50 }),
});

export type StateNameInput = zod.infer<typeof stateNameSchema>;
