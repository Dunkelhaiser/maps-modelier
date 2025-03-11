import { z as zod } from "zod";
import { nameField } from "../shared.js";

export const ethnicitySchema = zod.object({
    name: nameField({ field: "ethnicity", min: 1, max: 50 }),
});

export type EthnicityInput = zod.infer<typeof ethnicitySchema>;
