import { z as zod } from "zod";

export const addMembersSchema = zod
    .string({ message: "Select alliance members" })
    .length(3, { message: "Select existing country" })
    .array()
    .nonempty();

export type AddMembersInput = zod.infer<typeof addMembersSchema>;
