import { audioSchema, imageSchema, nameSchema } from "@utils/sharedSchemas";
import { z as zod } from "zod";

export const countrySchema = zod
    .object({
        tag: zod.string().trim().length(3, { message: "Enter valid tag" }),
        color: zod
            .string()
            .trim()
            .regex(/^#[0-9a-fA-F]{6}$/i, { message: "Enter valid color" }),
    })
    .merge(nameSchema);

export type CountryInput = zod.infer<typeof countrySchema>;

export const createCountrySchema = zod
    .object({
        tag: zod.string().trim().length(3, { message: "Enter valid tag" }),
        color: zod
            .string()
            .trim()
            .regex(/^#[0-9a-fA-F]{6}$/i, { message: "Enter valid color" }),
        flag: imageSchema,
        coatOfArms: imageSchema,
        anthem: zod
            .object({
                url: audioSchema,
            })
            .merge(nameSchema),
    })
    .merge(nameSchema);

export type CreateCountryInput = zod.infer<typeof createCountrySchema>;
