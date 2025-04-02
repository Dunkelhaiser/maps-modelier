import { z as zod } from "zod";
import { itemField } from "../shared.js";

export const partiesSchema = zod
    .object({
        partyId: itemField("Select party"),
        seatsNumber: zod.coerce.number().int().min(1, { message: "Enter number of seats" }),
        side: zod.enum(["ruling_coalition", "opposition", "neutral"], { message: "Select a side" }),
    })
    .array();

export const partiesFormSchema = zod.object({
    parties: partiesSchema,
});

export type PartiesInput = zod.infer<typeof partiesSchema>;
export type PartiesFormInput = zod.infer<typeof partiesFormSchema>;
