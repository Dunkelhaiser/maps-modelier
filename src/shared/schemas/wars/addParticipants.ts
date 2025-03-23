import { z as zod } from "zod";

const participantSchema = zod.object({
    countryId: zod.coerce.number({ message: "Select country" }),
    sideId: zod.coerce.number({ message: "Select side" }),
});

export const addParticipantsSchema = zod.array(participantSchema);

export type AddParticipantsInput = zod.infer<typeof addParticipantsSchema>;
