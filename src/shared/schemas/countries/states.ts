import { z as zod } from "zod";
import { itemField } from "../shared.js";

export const statesAssignmetSchema = zod.object({
    countryId: itemField("Select country"),
    states: itemField("Select states").array().nonempty({ message: "Select at least one state" }),
});

export type StatesAssignmentInput = zod.infer<typeof statesAssignmetSchema>;
