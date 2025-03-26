import { z as zod } from "zod";
import { imageSchema, nameField } from "../shared.js";

export const politicianSchema = zod.object({
    name: nameField({ field: "politician", min: 1, max: 50 }),
    portrait: imageSchema({ optional: true }),
});

export type PoliticianInput = zod.infer<typeof politicianSchema>;
