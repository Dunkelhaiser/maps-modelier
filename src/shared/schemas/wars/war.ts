import { z as zod } from "zod";
import { nameField } from "../shared.js";

export const warSchema = zod.object({
    name: nameField({ field: "war", min: 1, max: 50 }),
    aggressor: zod.coerce.number({ message: "Select aggressor country" }),
    defender: zod.coerce.number({ message: "Select defender country" }),
    startedAt: zod.coerce.date({ message: "Select start date" }),
    endedAt: zod.coerce.date({ message: "Select end date" }).optional(),
});

export type WarInput = zod.infer<typeof warSchema>;
