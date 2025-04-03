import { z as zod } from "zod";
import { getWithOrderSchema } from "../shared.js";

export const getPartiesSchema = getWithOrderSchema("name", "ideology", "members");

export type GetPartiesInput = zod.infer<typeof getPartiesSchema>;
