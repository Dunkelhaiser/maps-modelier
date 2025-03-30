import { z as zod } from "zod";
import { nameField } from "../shared.js";

export const assignHeadSchema = zod.object({
    head: zod.coerce.number().int({ message: "Select head" }),
    title: nameField({ field: "title", min: 3, max: 50 }),
    startDate: zod.coerce.date({ message: "Provide date the head assumed position" }),
    endDate: zod.coerce.date({ message: "Provide expected end term date" }).optional(),
});

export type AssignHeadInput = zod.infer<typeof assignHeadSchema>;
