import { z as zod } from "zod";

export const partiesSchema = zod
    .object({
        partyId: zod.coerce.number().int().min(1, { message: "Select party" }),
        seatsNumber: zod.coerce.number().int().min(1, { message: "Enter number of seats" }),
        side: zod.enum(["ruling_coalition", "opposition", "neutral"], { message: "Select side" }),
    })
    .array();

export const partiesFormSchema = zod.object({
    parties: partiesSchema,
});

export type PartiesInput = zod.infer<typeof partiesSchema>;
export type PartiesFormInput = zod.infer<typeof partiesFormSchema>;
