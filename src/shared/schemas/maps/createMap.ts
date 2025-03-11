import { z as zod } from "zod";
import { imageSchema } from "../shared.js";
import { mapName } from "./shared.js";

export const createMapSchema = zod.object({
    name: mapName,
    provinces: imageSchema(),
});

export type CreateMapInput = zod.infer<typeof createMapSchema>;
