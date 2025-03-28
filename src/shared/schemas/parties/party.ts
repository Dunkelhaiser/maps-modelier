import { z as zod } from "zod";
import { nameField } from "../shared.js";

const partyIdeologySchema = zod.object({
    ideologyId: zod.coerce.number({ message: "Select ideology" }),
    isPrimary: zod.boolean(),
});

export const partySchema = zod.object({
    name: nameField({ field: "name", min: 3, max: 50 }),
    acronym: nameField({ field: "acronym", min: 1, max: 10 }).optional(),
    color: zod
        .string()
        .trim()
        .regex(/^#[0-9a-fA-F]{6}$/i, { message: "Enter valid color" })
        .optional(),
    leader: zod.coerce.number({ message: "Select party leader" }),
    foundedAt: zod.coerce.date({ message: "Provide foundation date" }),
    ideologies: zod.array(partyIdeologySchema),
});

export type PartyInput = zod.infer<typeof partySchema>;
