import { z as zod } from "zod";
import { createSelectSchema } from "../shared.js";

export const [addMembersSchema, addMembersFormSchema] = createSelectSchema("members", "Select prominent member");

export type AddMembersInput = zod.infer<typeof addMembersSchema>;
export type AddMembersFormInput = zod.infer<typeof addMembersFormSchema>;
