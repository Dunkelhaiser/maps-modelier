import { z as zod } from "zod";
import { itemField } from "../shared.js";

export const addParticipantsSchema = zod
    .object({
        countryId: itemField("Select country"),
        sideId: itemField("Select side"),
    })
    .array();

export const addParticipantsFormSchema = zod.object({
    participants: addParticipantsSchema,
});

export type AddParticipantsInput = zod.infer<typeof addParticipantsSchema>;
export type AddParticipantsFormInput = zod.infer<typeof addParticipantsFormSchema>;
