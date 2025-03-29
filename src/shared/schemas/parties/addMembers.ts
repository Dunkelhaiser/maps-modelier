import { z as zod } from "zod";

export const addMembersSchema = zod.number({ message: "Select prominent members" }).array().nonempty();

export type AddMembersInput = zod.infer<typeof addMembersSchema>;

export const addMembersFormSchema = zod.object({
    members: zod.array(
        zod.object({
            politicianId: zod.coerce.number({ message: "Select prominent members" }),
        })
    ),
});

export type AddMembersFormInput = zod.infer<typeof addMembersFormSchema>;
