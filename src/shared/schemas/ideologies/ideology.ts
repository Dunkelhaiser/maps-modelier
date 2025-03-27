import { z as zod } from "zod";
import { nameField } from "../shared.js";

export const ideologySchema = zod.object({
    name: nameField({ field: "ideology", min: 1, max: 50 }),
    color: zod
        .string()
        .trim()
        .regex(/^#[0-9a-fA-F]{6}$/i, { message: "Enter valid color" })
        .optional(),
});

export type IdeologyInput = zod.infer<typeof ideologySchema>;
