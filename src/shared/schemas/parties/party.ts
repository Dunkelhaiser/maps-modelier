import { z as zod } from "zod";
import { nameField } from "../shared.js";

const partyIdeologySchema = zod.object({
    ideologyId: zod.coerce.number({ message: "Select ideology" }).min(1, { message: "Select ideology" }),
    isPrimary: zod.boolean(),
});

export const partySchema = zod.object({
    name: nameField({ field: "party", min: 3, max: 50 }),
    acronym: zod.string().trim().max(10, { message: "Acronym can't be longer than 10 characters" }).optional(),
    color: zod
        .string()
        .trim()
        .regex(/^#[0-9a-fA-F]{6}$/i, { message: "Enter valid color" })
        .optional(),
    leader: zod.coerce.number({ message: "Select party leader" }),
    membersCount: zod.coerce
        .number()
        .int({ message: "Provide party members count" })
        .min(1, { message: "Party must have at least one member" }),
    foundedAt: zod.coerce.date({ message: "Provide foundation date" }).optional(),
    ideologies: zod
        .array(partyIdeologySchema)
        .nonempty()
        .refine(
            (ideologies) => {
                const primaryCount = ideologies.filter((ideology) => ideology.isPrimary).length;
                return primaryCount === 1;
            },
            {
                message: "There can be only one primary ideology",
            }
        ),
});

export type PartyInput = zod.infer<typeof partySchema>;
