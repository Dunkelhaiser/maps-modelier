import { imageSchema } from "@utils/sharedSchemas";
import { z as zod } from "zod";

export const uploadMapImageSchema = zod.object({
    provinces: imageSchema,
});

export type UploadeMapImageInput = zod.infer<typeof uploadMapImageSchema>;
