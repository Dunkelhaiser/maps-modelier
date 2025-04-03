import { z as zod } from "zod";
import { getWithOrderSchema } from "../shared.js";

export const getEthnicitiesSchema = getWithOrderSchema("name", "population");

export type GetEthnicitiesInput = zod.infer<typeof getEthnicitiesSchema>;
