import { z as zod } from "zod";
import { colorField, imageSchema, nameField } from "../shared.js";

export const createCountrySchema = zod.object({
    name: nameField({ field: "country", min: 1, max: 50 }),
    color: colorField(),
    flag: imageSchema(),
});

export type CreateCountryInput = zod.infer<typeof createCountrySchema>;
