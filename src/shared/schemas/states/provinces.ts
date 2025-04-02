import { z as zod } from "zod";
import { itemField } from "../shared.js";

export const provincesSchema = zod.object({
    provinces: itemField("Select provinces").array(),
});

export type ProvincesInput = zod.infer<typeof provincesSchema>;

export const provincesAssignmetSchema = zod
    .object({
        stateId: itemField("Select state"),
    })
    .merge(provincesSchema);

export type ProvincesAssignmentInput = zod.infer<typeof provincesAssignmetSchema>;
