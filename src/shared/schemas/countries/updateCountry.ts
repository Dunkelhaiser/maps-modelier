import { z as zod } from "zod";
import { audioSchema, imageSchema, nameField } from "../shared.js";

export const updateCountrySchema = zod.object({
    name: nameField({ field: "country", min: 1, max: 50 }),
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
            name: nameField({ field: "anthem", min: 0, max: 50 }),
            url: audioSchema({ optional: true }),
        })
        .superRefine((data, ctx) => {
            const nameProvided = data.name.trim().length > 0;
            const urlProvided = Boolean(data.url);

            if (nameProvided !== urlProvided) {
                ctx.addIssue({
                    code: zod.ZodIssueCode.custom,
                    message: "Both anthem name and audio file must be provided, or neither",
                    path: urlProvided ? ["name"] : ["url"],
                });
            }
        }),
});

export type UpdateCountryInput = zod.infer<typeof updateCountrySchema>;
