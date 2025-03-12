import { z as zod } from "zod";
import { nameField } from "../shared.js";

export const createAllianceSchema = zod.object({
    name: nameField({ field: "alliance", min: 3, max: 50 }),
    type: zod.enum(["economic", "military", "political"], { message: "Select alliance type" }),
    leader: zod.string().trim().length(3).optional(),
});

export type CreateAllianceInput = zod.infer<typeof createAllianceSchema>;
