import { z as zod } from "zod";
import { getWithOrderSchema } from "../shared.js";

export const getCountriesSchema = getWithOrderSchema("commonName", "population");

export type GetCountriesInput = zod.infer<typeof getCountriesSchema>;
