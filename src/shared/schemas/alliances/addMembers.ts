import { z as zod } from "zod";

export const addMembersSchema = zod.number({ message: "Select alliance members" }).array().nonempty();

export type AddMembersInput = zod.infer<typeof addMembersSchema>;

export const addMembersFormSchema = zod.object({
    members: zod.array(
        zod.object({
            countryId: zod.coerce.number({ message: "Select alliance members" }),
        })
    ),
});

export type AddMembersFormInput = zod.infer<typeof addMembersFormSchema>;
