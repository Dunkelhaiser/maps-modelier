import { z as zod } from "zod";
import { nameField } from "../shared.js";

export const allianceSchema = zod.object({
    name: nameField({ field: "alliance", min: 3, max: 50 }),
    type: zod.enum(["economic", "military", "political"], { message: "Select alliance type" }),
    leader: zod.string({ message: "Select alliance leader" }).trim().length(3, { message: "Select alliance leader" }),
});

export type AllianceInput = zod.infer<typeof allianceSchema>;
