import { z as zod } from "zod";

export const addParticipantsSchema = zod
    .object({
        countryId: zod.coerce.number().int().min(1, { message: "Select country" }),
        sideId: zod.coerce.number().int().min(1, { message: "Select side" }),
    })
    .array();

export const addParticipantsFormSchema = zod.object({
    participants: addParticipantsSchema,
});

export type AddParticipantsInput = zod.infer<typeof addParticipantsSchema>;
export type AddParticipantsFormInput = zod.infer<typeof addParticipantsFormSchema>;
