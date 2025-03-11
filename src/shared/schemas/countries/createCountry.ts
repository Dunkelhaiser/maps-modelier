import { z as zod } from "zod";
import { audioSchema, imageSchema, nameField } from "../shared.js";

export const createCountrySchema = zod.object({
    name: nameField({ field: "country", min: 1, max: 50 }),
    tag: zod
        .string()
        .trim()
        .toUpperCase()
        .regex(/^[A-Z]{3}$/, { message: "Enter valid tag" }),
    color: zod
        .string()
        .trim()
        .regex(/^#[0-9a-fA-F]{6}$/i, { message: "Enter valid color" })
        .optional(),
    flag: imageSchema(),
    coatOfArms: imageSchema(),
    anthem: zod.object({
        name: nameField({ field: "anthem", min: 1, max: 50 }),
        url: audioSchema(),
    }),
});

export type CreateCountryInput = zod.infer<typeof createCountrySchema>;
