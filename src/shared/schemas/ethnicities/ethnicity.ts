import { z as zod } from "zod";
import { nameField } from "../shared.js";

export const ethnicitySchema = zod.object({
    name: nameField({ field: "ethnicity", min: 1, max: 50 }),
    color: zod
        .string()
        .trim()
        .regex(/^#[0-9a-fA-F]{6}$/i, { message: "Enter valid color" })
        .optional(),
});

export type EthnicityInput = zod.infer<typeof ethnicitySchema>;
