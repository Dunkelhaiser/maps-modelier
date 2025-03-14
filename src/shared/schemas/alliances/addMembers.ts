import { z as zod } from "zod";

export const addMembersSchema = zod
    .string({ message: "Select alliance members" })
    .length(3, { message: "Select existing country" })
    .array()
    .nonempty();

export type AddMembersInput = zod.infer<typeof addMembersSchema>;

export const addMembersFormSchema = zod.object({
    members: zod.array(
        zod.object({
            countryTag: zod
                .string({ message: "Select alliance members" })
                .length(3, { message: "Select existing country" }),
        })
    ),
});

export type AddMembersFormInput = zod.infer<typeof addMembersFormSchema>;
