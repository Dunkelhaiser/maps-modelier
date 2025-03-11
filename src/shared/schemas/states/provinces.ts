import { z as zod } from "zod";

export const provincesSchema = zod.object({
    provinces: zod.array(zod.number()),
});

export type ProvincesInput = zod.infer<typeof provincesSchema>;

export const provincesAssignmetSchema = zod
    .object({
        stateId: zod.number(),
    })
    .merge(provincesSchema);

export type ProvincesAssignmentInput = zod.infer<typeof provincesAssignmetSchema>;
