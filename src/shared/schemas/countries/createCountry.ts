import { z as zod } from "zod";
import { audioSchema, imageSchema, nameSchema } from "../shared";

export const createCountrySchema = zod
    .object({
        tag: zod
            .string()
            .trim()
            .toUpperCase()
            .regex(/^[A-Z]{3}$/, { message: "Enter valid tag" }),
        color: zod
            .string()
            .trim()
            .regex(/^#[0-9a-fA-F]{6}$/i, { message: "Enter valid color" }),
        flag: imageSchema(),
        coatOfArms: imageSchema(),
        anthem: zod
            .object({
                url: audioSchema(),
            })
            .merge(nameSchema),
    })
    .merge(nameSchema);

export type CreateCountryInput = zod.infer<typeof createCountrySchema>;
