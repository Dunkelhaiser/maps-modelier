import { z as zod } from "zod";
import { getWithOrderSchema } from "../shared.js";

export const getWarsSchema = getWithOrderSchema("name", "participants", "aggressor", "defender");

export type GetWarsInput = zod.infer<typeof getWarsSchema>;
