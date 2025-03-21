import { z as zod } from "zod";
import { imageSchema, nameField } from "../shared.js";

export const createCountrySchema = zod.object({
    name: nameField({ field: "country", min: 1, max: 50 }),
    color: zod
        .string()
        .trim()
        .regex(/^#[0-9a-fA-F]{6}$/i, { message: "Enter valid color" })
        .optional(),
    flag: imageSchema(),
});

export type CreateCountryInput = zod.infer<typeof createCountrySchema>;
