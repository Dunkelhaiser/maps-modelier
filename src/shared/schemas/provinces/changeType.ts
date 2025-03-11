import { z as zod } from "zod";

export const changeTypeSchema = zod.object({
    provinceIds: zod.array(zod.number()),
    type: zod.enum(["land", "water"]),
});

export type ChangeTypeInput = zod.infer<typeof changeTypeSchema>;
