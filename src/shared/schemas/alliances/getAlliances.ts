import { z as zod } from "zod";
import { getWithOrderSchema } from "../shared.js";

export const getAlliancesSchema = getWithOrderSchema("name", "type", "members", "leader");

export type GetAlliancesInput = zod.infer<typeof getAlliancesSchema>;
