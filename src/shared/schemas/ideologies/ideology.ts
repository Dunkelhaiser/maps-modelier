import { z as zod } from "zod";
import { colorField, nameField } from "../shared.js";

export const ideologySchema = zod.object({
    name: nameField({ field: "ideology", min: 1, max: 50 }),
    color: colorField(),
});

export type IdeologyInput = zod.infer<typeof ideologySchema>;
