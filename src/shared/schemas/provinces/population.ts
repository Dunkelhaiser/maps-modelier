import { z as zod } from "zod";
import { itemField } from "../shared.js";

export const populationSchema = zod
    .object({
        ethnicityId: itemField("Select ethnicity"),
        population: zod.coerce.number().int().min(1, { message: "Enter population" }),
    })
    .array();

export const populationFormSchema = zod.object({
    populations: populationSchema,
});

export type PopulationInput = zod.infer<typeof populationSchema>;
export type PopulationFormInput = zod.infer<typeof populationFormSchema>;
