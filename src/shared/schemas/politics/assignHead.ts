import { z as zod } from "zod";
import { itemField, nameField } from "../shared.js";

export const assignHeadSchema = zod.object({
    head: itemField("Select head"),
    title: nameField({ field: "title", min: 3, max: 50 }),
    startDate: zod.coerce.date({ message: "Provide date the head assumed position" }),
    endDate: zod.coerce.date({ message: "Provide expected end term date" }).optional(),
});

export type AssignHeadInput = zod.infer<typeof assignHeadSchema>;
