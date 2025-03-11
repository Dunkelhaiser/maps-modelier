import { z as zod } from "zod";
import { imageSchema } from "../shared.js";

export const uploadMapImageSchema = zod.object({
    provinces: imageSchema(),
});

export type UploadeMapImageInput = zod.infer<typeof uploadMapImageSchema>;
