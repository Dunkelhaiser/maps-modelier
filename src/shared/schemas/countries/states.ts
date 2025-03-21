import { z as zod } from "zod";

export const statesAssignmetSchema = zod.object({
    countryId: zod.number(),
    states: zod.array(zod.number()),
});

export type StatesAssignmentInput = zod.infer<typeof statesAssignmetSchema>;
