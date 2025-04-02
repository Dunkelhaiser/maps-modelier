import { z as zod } from "zod";
import { itemField } from "../shared.js";

export const changeTypeSchema = zod.object({
    provinceIds: itemField("Select provinces").array(),
    type: zod.enum(["land", "water"]),
});

export type ChangeTypeInput = zod.infer<typeof changeTypeSchema>;
