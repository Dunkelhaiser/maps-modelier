import { z as zod } from "zod";
import { audioSchema, imageSchema, nameSchema } from "../shared";

export const updateCountrySchema = zod
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
        flag: imageSchema({ optional: true }),
        coatOfArms: imageSchema({ optional: true }),
        anthem: zod
            .object({
                url: audioSchema({ optional: true }),
            })
            .merge(nameSchema),
    })
    .merge(nameSchema);

export type UpdateCountryInput = zod.infer<typeof updateCountrySchema>;
