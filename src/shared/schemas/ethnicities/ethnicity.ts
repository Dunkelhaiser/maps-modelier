import { z as zod } from "zod";
import { colorField, nameField } from "../shared.js";

export const ethnicitySchema = zod.object({
    name: nameField({ field: "ethnicity", min: 1, max: 50 }),
    color: colorField(),
});

export type EthnicityInput = zod.infer<typeof ethnicitySchema>;
