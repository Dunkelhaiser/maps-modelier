import { z as zod } from "zod";

export const populationSchema = zod.object({
    populations: zod
        .object({
            ethnicityId: zod.coerce.number().int().min(1, { message: "Select ethnicity" }),
            population: zod.coerce.number().int().min(1, { message: "Enter population" }),
        })
        .array(),
});

export type PopulationInput = zod.infer<typeof populationSchema>;
