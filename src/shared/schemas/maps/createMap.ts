import { z as zod } from "zod";
import { imageSchema } from "../shared";
import { mapName } from "./shared";

export const createMapSchema = zod.object({
    name: mapName,
    provinces: imageSchema(),
});

export type CreateMapInput = zod.infer<typeof createMapSchema>;
