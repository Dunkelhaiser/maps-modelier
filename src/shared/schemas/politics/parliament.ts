import { z as zod } from "zod";
import { nameField } from "../shared.js";

export const parliamentSchema = zod.object({
    name: nameField({ field: "parliament", min: 1, max: 50 }),
    seatsNumber: zod.number().int().min(1, { message: "Provide number of seats" }),
});

export type ParliamentInput = zod.infer<typeof parliamentSchema>;
