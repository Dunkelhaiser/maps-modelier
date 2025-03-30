import { z as zod } from "zod";

export const partyScheme = zod
    .object({
        partyId: zod.coerce.number().int().min(1, { message: "Select party" }),
        seatsNumber: zod.coerce.number().int().min(1, { message: "Enter number of seats" }),
        side: zod.enum(["ruling_coalition", "opposition", "neutral"], { message: "Select side" }),
    })
    .array();

export const partyFormSchema = zod.object({
    party: partyScheme,
});

export type PartyInput = zod.infer<typeof partyScheme>;
export type PartyFormInput = zod.infer<typeof partyFormSchema>;
