import { z as zod } from "zod";
import { itemField, nameField } from "../shared.js";

export const allianceSchema = zod.object({
    name: nameField({ field: "alliance", min: 3, max: 50 }),
    type: zod.enum(["economic", "military", "political"], { message: "Select alliance type" }),
    leader: itemField("Select alliance leader"),
});

export type AllianceInput = zod.infer<typeof allianceSchema>;
