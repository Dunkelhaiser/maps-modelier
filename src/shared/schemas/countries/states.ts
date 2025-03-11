import { z as zod } from "zod";

export const statesAssignmetSchema = zod.object({
    countryTag: zod.string().trim().length(3),
    states: zod.array(zod.number()),
});

export type StatesAssignmentInput = zod.infer<typeof statesAssignmetSchema>;
