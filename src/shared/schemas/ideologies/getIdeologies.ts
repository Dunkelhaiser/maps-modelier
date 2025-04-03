import { z as zod } from "zod";
import { getWithOrderSchema } from "../shared.js";

export const getIdeologiesSchema = getWithOrderSchema("name");

export type GetIdeologiesInput = zod.infer<typeof getIdeologiesSchema>;
