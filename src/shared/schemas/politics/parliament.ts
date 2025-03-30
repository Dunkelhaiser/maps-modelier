import { z as zod } from "zod";
import { nameField } from "../shared.js";

export const parliamentSchema = zod.object({
    name: nameField({ field: "parliament", min: 1, max: 50 }),
    seatsNumber: zod.coerce.number().int().min(1, { message: "Provide number of seats" }),
    oppositionLeaderId: zod.coerce.number().int({ message: "Select opposition leader" }).optional(),
    coalitionLeaderId: zod.coerce.number().int({ message: "Select coalition leader" }).optional(),
});

export type ParliamentInput = zod.infer<typeof parliamentSchema>;
